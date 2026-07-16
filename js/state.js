/**
 * Estado da sessão, guardado apenas no browser (localStorage).
 * Não é enviado para nenhum servidor a menos que o utilizador
 * escolha exportar ou submeter os resultados no ecrã de síntese.
 */

const STORAGE_KEY = 'llm-bmc-pme:sessao';

function estadoInicial() {
  return {
    iniciadoEm: new Date().toISOString(),
    consentimento: false,
    perfilEmpresa: {},  // setor, colaboradores, criterioFinanceiro, escalaoFinanceiro, pais, regiao
    diagnostico: {},   // { blocoId: { prontidao, impacto, prioridade } }
    blocosSelecionados: [] // blocoId[] escolhidos no Instrumento 2 para aprofundar
  };
}

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

function guardarEstado(estado) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
    return true;
  } catch (e) {
    console.error('Não foi possível guardar o estado:', e);
    return false;
  }
}

function limparEstado() {
  localStorage.removeItem(STORAGE_KEY);
}

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

function limparDiagnostico() {
  const estado = lerEstado();
  estado.diagnostico = {};
  estado.blocosSelecionados = []; // dependem da classificação, ficariam órfãos
  guardarEstado(estado);
  return estado;
}

function limparSelecao() {
  const estado = lerEstado();
  estado.blocosSelecionados = [];
  guardarEstado(estado);
  return estado;
}
