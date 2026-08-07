/**
 * Code.gs — recebe os dados enviados pela ferramenta "LLM em PME"
 * (https://ricarduz.github.io/llm-bmc-pme/) e grava-os nesta Google
 * Sheet, numa folha diferente consoante o tipo de dado.
 *
 * Como isto liga ao site:
 *   1. Este ficheiro é implementado como "Aplicação Web" (Implementar →
 *      Nova implementação → Aplicação Web → Executar como: Eu → Quem
 *      tem acesso: Qualquer pessoa).
 *   2. O URL dessa implementação cola-se em GOOGLE_SHEETS_URL, no topo
 *      de js/resultados.js, no repositório do site.
 *   3. A partir daí, o site faz um POST para esse URL em diferentes
 *      momentos consoante o percurso: o painel de especialistas envia
 *      "avaliacao" (página de resultados, ver resultados.js); o percurso
 *      PME (pme.html, sem nomes de instrumentos à vista) envia
 *      "diagnostico"; e "contacto" sempre que alguém deixa o email para
 *      receber os resultados do estudo.
 *
 * IMPORTANTE: sempre que editares este código, tens de voltar a fazer
 * Implementar → Gerir implementações → ✏️ → Versão: Nova versão →
 * Implementar. Só gravar o ficheiro (Ctrl+S) NÃO atualiza a implementação
 * já publicada — o site continua a falar com o código antigo até
 * publicares uma versão nova.
 */

/**
 * Ponto de entrada para pedidos POST — é isto que o site chama.
 * `e.postData.contents` vem como texto (o site envia com
 * Content-Type: text/plain, de propósito, para evitar um pedido extra
 * de verificação de CORS que os navegadores fazem antes de pedidos
 * "não simples" — ver o comentário em enviarParaGoogleSheets, em
 * resultados.js). Por isso o primeiro passo é sempre fazer o parse
 * manual do JSON a partir desse texto.
 */
function doPost(e) {
  const dados = JSON.parse(e.postData.contents);

  if (dados.tipo === 'contacto') {
    guardarContacto(dados);
  } else if (dados.tipo === 'diagnostico') {
    guardarDiagnostico(dados);
  } else if (dados.tipo === 'avaliacao') {
    guardarAvaliacao(dados);
  }
  // Não há "else" com erro — se chegar um tipo desconhecido, ignora-se
  // em silêncio. O site nunca lê a resposta desta função (usa
  // mode: 'no-cors'), por isso devolver um erro aqui não ajudaria em
  // nada quem está do lado do navegador; o que importa é nunca
  // rebentar com uma exceção não tratada, que ficaria sem resposta
  // nenhuma no registo de execuções.

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Pedidos GET (por exemplo, colar o URL diretamente no navegador) não
 * fazem parte do fluxo normal — o site só usa POST. Isto serve só para,
 * se alguém (tu, a testar) abrir o URL à mão, aparecer uma mensagem
 * clara em vez do ecrã genérico e confuso do Google Drive a dizer que
 * "não é possível abrir o ficheiro".
 */
function doGet(e) {
  return ContentService
    .createTextOutput(
      'Este endereço só aceita pedidos POST, enviados automaticamente pela ' +
      'ferramenta em https://ricarduz.github.io/llm-bmc-pme/. ' +
      'Se estás a ver esta mensagem, o endpoint está ativo e a funcionar — ' +
      'não há nada para testar aqui diretamente no navegador.'
    )
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Nomes dos 9 blocos do BMC, pela mesma ordem canónica usada no site
 * (ver BMC_BLOCOS em js/data.js). Usa-se para desenhar as colunas fixas
 * da folha "Diagnostico" — o site envia dados.diagnostico como um
 * objeto { "Nome do Bloco": "Prioridade" }, só com os blocos já
 * respondidos, por isso aqui percorre-se sempre esta lista fixa (em vez
 * das chaves do objeto recebido) para todas as linhas terem sempre as
 * mesmas colunas, mesmo que faltem blocos por algum motivo.
 */
const NOMES_BLOCOS_BMC = [
  'Segmentos de Clientes',
  'Proposta de Valor',
  'Canais',
  'Relacionamento com Clientes',
  'Fontes de Receita',
  'Atividades-Chave',
  'Recursos-Chave',
  'Parcerias-Chave',
  'Estrutura de Custos'
];

/**
 * Devolve a folha com o nome dado, criando-a se ainda não existir, e
 * garante SEMPRE que a linha 1 tem exatamente o cabeçalho atual —
 * não só na primeira vez.
 *
 * Isto corrige um problema real: como o código já mudou várias vezes
 * a estrutura de colunas (acrescentar "Perfil do especialista",
 * remover "Blocos aprofundados", etc.), e a versão anterior desta
 * função só escrevia o cabeçalho quando a folha estava completamente
 * vazia, cada mudança de estrutura deixava o cabeçalho existente
 * "congelado" na versão antiga, enquanto as linhas novas continuavam a
 * ser escritas na estrutura atual — cabeçalho e conteúdo desalinhavam-
 * -se a cada alteração. Agora a linha 1 é sempre reescrita para bater
 * certo com o cabecalho[] que o código está de facto a usar.
 *
 * Não apaga nem reordena as linhas de dados já existentes — só corrige
 * os rótulos da linha 1. Se a estrutura de colunas mudar (nº de colunas
 * diferente), as linhas antigas continuam com os valores nas posições
 * antigas, agora só com os rótulos certos por cima; não há forma de
 * corrigir retroativamente dados escritos com uma estrutura diferente
 * sem os reveres à mão.
 */
function obterOuCriarFolha(nome, cabecalho) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let aba = ss.getSheetByName(nome);
  if (!aba) {
    aba = ss.insertSheet(nome);
  }
  aba.getRange(1, 1, 1, cabecalho.length).setValues([cabecalho]);
  aba.setFrozenRows(1);
  return aba;
}

/**
 * Grava `linha` na folha, substituindo uma linha já existente com o
 * mesmo sessionId (na coluna `colunaSessionId`, numerada a partir de 1)
 * em vez de acrescentar sempre uma linha nova — evita registos
 * fragmentados quando a mesma sessão envia dados mais do que uma vez
 * (ex: uma vez ao descarregar o relatório, outra vez ao concluir).
 *
 * Procura só nas primeiras 5000 linhas (SpreadsheetApp não tem um
 * índice/pesquisa nativa eficiente para isto) — mais do que suficiente
 * para o volume de respostas esperado neste estudo; se a folha alguma
 * vez crescer muito para lá disso, passa a acrescentar sempre no fim
 * em vez de dar erro.
 */
function gravarLinha(aba, colunaSessionId, sessionId, linha) {
  if (sessionId) {
    const ultimaLinha = Math.min(aba.getLastRow(), 5000);
    if (ultimaLinha >= 2) {
      const valoresColuna = aba.getRange(2, colunaSessionId, ultimaLinha - 1, 1).getValues();
      for (let i = 0; i < valoresColuna.length; i++) {
        if (valoresColuna[i][0] === sessionId) {
          aba.getRange(i + 2, 1, 1, linha.length).setValues([linha]);
          return;
        }
      }
    }
  }
  aba.appendRow(linha);
}

/**
 * Grava uma linha na folha "Contacto" — email de quem quer receber os
 * resultados finais do estudo. `origem` distingue se veio do percurso
 * PME (pme.html) ou do painel de especialistas (resultados.html).
 * `sessionId` permite, se precisares, cruzar este contacto com a
 * respetiva linha de "Diagnostico" ou "Avaliacao".
 */
function guardarContacto(dados) {
  const aba = obterOuCriarFolha('Contacto', ['Data', 'Origem', 'Email', 'Consentimento', 'ID da sessão']);
  gravarLinha(aba, 5, dados.sessionId, [dados.data, dados.origem || '', dados.email, dados.consentimento ? 'Sim' : 'Não', dados.sessionId || '']);
}

/**
 * Grava uma linha na folha "Avaliacao" — a resposta de um especialista
 * do painel aos 4 critérios (utilidade percebida, aplicabilidade,
 * consistência com a literatura, completude, cada um numa escala 1-5,
 * com comentário opcional) e à reflexão livre da entrevista. Inclui o
 * perfil do especialista (Gestor PME / Profissional de TI / Académico)
 * para se poder cruzar as respostas por perfil, tal como previsto na
 * Tabela 4 da dissertação.
 */
function guardarAvaliacao(dados) {
  const cabecalho = [
    'Concluído em', 'Origem do envio', 'ID da sessão', 'Perfil do especialista',
    'Utilidade percebida', 'Comentário (utilidade)',
    'Aplicabilidade', 'Comentário (aplicabilidade)',
    'Consistência com a literatura', 'Comentário (consistência)',
    'Completude', 'Comentário (completude)',
    'Reflexão livre'
  ];
  const aba = obterOuCriarFolha('Avaliacao', cabecalho);

  gravarLinha(aba, 3, dados.sessionId, [
    dados.concluidoEm,
    dados.origem || '',
    dados.sessionId || '',
    dados.perfilEspecialista || '',
    dados.utilidade || '', dados.utilidadeComentario || '',
    dados.aplicabilidade || '', dados.aplicabilidadeComentario || '',
    dados.consistencia || '', dados.consistenciaComentario || '',
    dados.completude || '', dados.completudeComentario || '',
    dados.reflexao || ''
  ]);
}

/**
 * Grava uma linha na folha "Diagnostico" com o resultado completo de
 * uma sessão. Como há dois momentos em que o site pode enviar isto
 * (Descarregar / Terminar — ver dados.origem), a mesma sessão pode
 * chamar esta função duas vezes; gravarLinha() substitui a linha
 * anterior da mesma sessão em vez de duplicar.
 */
function guardarDiagnostico(dados) {
  const cabecalho = [
    'Concluído em', 'Origem do envio', 'ID da sessão', 'Consentimento inicial',
    'Percebeu o resultado', 'Considera útil',
    'Setor', 'Colaboradores', 'Faturação', 'Classificação PME', 'País', 'Região',
    ...NOMES_BLOCOS_BMC
  ];
  const aba = obterOuCriarFolha('Diagnostico', cabecalho);

  const perfil = dados.perfil || {};
  const diagnostico = dados.diagnostico || {};

  gravarLinha(aba, 3, dados.sessionId, [
    dados.concluidoEm,
    dados.origem || '',
    dados.sessionId || '',
    dados.consentimentoInicial || '',
    dados.satisfacaoPercebeu || '',
    dados.satisfacaoUtil || '',
    perfil.setor || '',
    perfil.colaboradores || '',
    perfil.faturacao || '',
    perfil.classificacaoSME || '',
    perfil.pais || '',
    perfil.regiao || '',
    // uma coluna por bloco do BMC, na ordem fixa de NOMES_BLOCOS_BMC —
    // fica em branco se esse bloco não tiver sido respondido
    ...NOMES_BLOCOS_BMC.map(nome => diagnostico[nome] || '')
  ]);
}
