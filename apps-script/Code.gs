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
 *   3. A partir daí, o site faz um POST para esse URL sempre que: a
 *      pessoa avança do Passo 1 para o Passo 2 (para garantir que os
 *      dados chegam mesmo que não descarregue nada), quando descarrega
 *      o resumo, quando termina a sessão, e quando guarda um contacto
 *      por email — ver enviarParaGoogleSheets() em resultados.js.
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
 * Devolve a folha com o nome dado, criando-a (com o cabeçalho indicado)
 * se ainda não existir. Também escreve o cabeçalho se a folha já existir
 * mas estiver vazia (por exemplo, se alguém limpar o conteúdo sem apagar
 * a folha) — sem isto, uma folha "existente mas vazia" nunca recebia
 * cabeçalho, só linhas de dados por baixo de nada.
 */
function obterOuCriarFolha(nome, cabecalho) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let aba = ss.getSheetByName(nome);
  if (!aba) {
    aba = ss.insertSheet(nome);
  }
  if (aba.getLastRow() === 0) {
    aba.appendRow(cabecalho);
    aba.setFrozenRows(1);
  }
  return aba;
}

/**
 * Grava uma linha na folha "Contacto" — email de quem quer receber os
 * resultados finais do estudo. `sessionId` permite, se precisares,
 * cruzar este contacto com a respetiva sessão de diagnóstico na folha
 * "Diagnostico" (não é obrigatório para nada, só útil para análise).
 */
function guardarContacto(dados) {
  const aba = obterOuCriarFolha('Contacto', ['Data', 'Email', 'Consentimento', 'ID da sessão']);
  aba.appendRow([dados.data, dados.email, dados.consentimento ? 'Sim' : 'Não', dados.sessionId || '']);
}

/**
 * Grava uma linha na folha "Diagnostico" com o resultado completo de
 * uma sessão. Como há três momentos em que o site pode enviar isto
 * (Seguinte / Descarregar / Terminar — ver dados.origem), a mesma pessoa
 * pode gerar mais do que uma linha; usa `sessionId` para identificares
 * quais pertencem à mesma sessão (por exemplo, filtrando para manter só
 * a última linha de cada sessionId antes de analisar os dados).
 */
function guardarDiagnostico(dados) {
  const cabecalho = [
    'Concluído em', 'Origem do envio', 'ID da sessão', 'Consentimento inicial',
    'Percebeu o resultado', 'Considera útil',
    'Setor', 'Colaboradores', 'Faturação', 'Classificação PME', 'País', 'Região',
    ...NOMES_BLOCOS_BMC,
    'Blocos aprofundados'
  ];
  const aba = obterOuCriarFolha('Diagnostico', cabecalho);

  const perfil = dados.perfil || {};
  const diagnostico = dados.diagnostico || {};

  aba.appendRow([
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
    ...NOMES_BLOCOS_BMC.map(nome => diagnostico[nome] || ''),
    dados.blocosAprofundados || ''
  ]);
}
