/**
 * state.js — gestão do estado da sessão.
 *
 * Tudo o que o utilizador preenche (perfil da empresa, respostas ao
 * diagnóstico, blocos escolhidos para aprofundar, satisfação, contacto)
 * fica guardado só neste navegador, em localStorage. Nada disto é enviado
 * para lado nenhum a não ser que o utilizador escolha explicitamente
 * "Guardar contacto" (envia o email) ou que o botão de download dispare o
 * envio opcional para o Google Sheets (ver GOOGLE_SHEETS_URL em resultados.js).
 *
 * Todas as páginas partilham este ficheiro e a mesma chave de storage —
 * é o que permite passar dados de uma página para a seguinte (ex: o
 * diagnóstico feito no Instrumento 1 aparece no Instrumento 2) sem back-end.
 */

const STORAGE_KEY = 'llm-bmc-pme:sessao';

/**
 * Formato "vazio" de uma sessão nova. Sempre que se acede a uma página
 * sem ainda haver nada guardado (primeira visita, ou depois de limpar/
 * terminar a sessão), é isto que se usa como ponto de partida.
 */
function estadoInicial() {
  return {
    iniciadoEm: new Date().toISOString(),
    consentimento: false,
    perfilEmpresa: {},   // setor, colaboradores, criterioFinanceiro, escalaoFinanceiro, pais, regiao (Passo 1 do index)
    diagnostico: {},     // { blocoId: { prontidao, impacto, prioridade } } — uma entrada por bloco do BMC avaliado no Instrumento 1
    blocosSelecionados: [], // ids dos blocos escolhidos no Instrumento 2 para aprofundar no Instrumento 3
    satisfacao: {},      // { percebeu: 'sim'|'nao', util: 'sim'|'nao' } — preenchido na página de resultados
    contacto: {}         // { email, consentimento, guardadoEm } — só existe se o utilizador quiser receber os resultados do estudo
  };
}

/**
 * Lê o estado do localStorage. Se nunca tiver sido guardado nada, ou se o
 * JSON estiver corrompido por algum motivo, devolve sempre um estado
 * inicial válido — nunca undefined/null, para as páginas não terem de
 * andar a verificar isso em todo o lado.
 *
 * O `if (!estado.perfilEmpresa)` serve para sessões antigas: se alguém
 * tiver uma sessão guardada de antes de existir o Passo 1 (perfil da
 * empresa), o objeto não teria esse campo e o código ia rebentar mais
 * tarde ao tentar ler estado.perfilEmpresa.setor. Isto evita isso.
 */
function lerEstado() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return estadoInicial();
    const estado = JSON.parse(raw);
    if (!estado.perfilEmpresa) estado.perfilEmpresa = {};
    return estado;
  } catch (e) {
    console.error('Não foi possível ler o estado guardado:', e);
    return estadoInicial();
  }
}

/**
 * Guarda o objeto de estado inteiro no localStorage (substitui sempre o
 * que lá estava, não faz merge — por isso quem chama esta função tem de
 * ler o estado atual primeiro, alterar só o que precisa, e gravar tudo
 * de volta). O try/catch é para o caso raro de o localStorage estar
 * cheio ou desativado (ex: modo privado em alguns navegadores).
 */
function guardarEstado(estado) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
    return true;
  } catch (e) {
    console.error('Não foi possível guardar o estado:', e);
    return false;
  }
}

/** Apaga a sessão por completo. Usado em "Recomeçar" e "Terminar sessão". */
function limparEstado() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Grava o resultado de um bloco do diagnóstico (Instrumento 1) e já
 * calcula a prioridade a partir da matriz de decisão (classificarBloco,
 * definida em data.js). Cada chamada relê o estado atual do zero, para
 * nunca sobrescrever com dados desatualizados se houver outra alteração
 * entretanto — mais seguro do que passar um estado antigo por parâmetro.
 */
function atualizarDiagnostico(blocoId, prontidao, impacto) {
  const estado = lerEstado();
  estado.diagnostico[blocoId] = {
    prontidao,
    impacto,
    prioridade: classificarBloco(prontidao, impacto)
  };
  guardarEstado(estado);
  return estado;
}

/**
 * Limpa as respostas do Instrumento 1 (botão "Limpar respostas").
 * Importante: limpa também blocosSelecionados. Se não o fizéssemos, um
 * bloco selecionado no Instrumento 2 podia ficar "órfão" — sem
 * diagnóstico associado — e o Instrumento 3 podia tentar mostrar a ficha
 * de um bloco que já não tem prioridade calculada.
 */
function limparDiagnostico() {
  const estado = lerEstado();
  estado.diagnostico = {};
  estado.blocosSelecionados = [];
  guardarEstado(estado);
  return estado;
}

/** Limpa só a seleção de blocos a aprofundar (botão "Limpar seleção" no Instrumento 2), sem tocar no diagnóstico. */
function limparSelecao() {
  const estado = lerEstado();
  estado.blocosSelecionados = [];
  guardarEstado(estado);
  return estado;
}
