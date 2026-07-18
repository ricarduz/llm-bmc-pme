/**
 * index.js — lógica da página inicial, organizada em três passos:
 *   Passo 1 — perfil da empresa (setor, dimensão, país/região)
 *   Passo 2 — grelha explicativa dos 9 blocos do BMC (só para orientar)
 *   Passo 3 — os três instrumentos + consentimento + botão de início
 *
 * Os três <section> ficam sempre no DOM ao mesmo tempo; "avançar" e
 * "voltar" é só esconder/mostrar com o atributo hidden (ver irParaPasso).
 * Não há navegação real entre páginas aqui, é tudo dentro do mesmo HTML.
 */

/**
 * Opções do dropdown de escalão financeiro, consoante o critério
 * escolhido (Volume de negócios ou Balanço total) — os limiares vêm da
 * Recomendação 2003/361/CE. Os valores ('micro'/'pequena'/'media'/
 * 'grande') são os mesmos nos dois critérios, só o texto mostrado muda
 * (por exemplo, o limite de "média" é 50M no volume mas 43M no balanço).
 */
const ESCALOES = {
  volume: [
    { valor: 'micro', chave: 'perfil-escalao-micro' },
    { valor: 'pequena', chave: 'perfil-escalao-pequena' },
    { valor: 'media', chave: 'perfil-escalao-media-volume' },
    { valor: 'grande', chave: 'perfil-escalao-grande-volume' }
  ],
  balanco: [
    { valor: 'micro', chave: 'perfil-escalao-micro' },
    { valor: 'pequena', chave: 'perfil-escalao-pequena' },
    { valor: 'media', chave: 'perfil-escalao-media-balanco' },
    { valor: 'grande', chave: 'perfil-escalao-grande-balanco' }
  ]
};

/** Devolve 'volume' ou 'balanco', consoante o radio button selecionado. 'volume' é o valor por omissão (coerente com o HTML, onde esse radio já vem marcado). */
function criterioAtivo() {
  const input = document.querySelector('input[name="criterio-financeiro"]:checked');
  return input ? input.value : 'volume';
}

/**
 * Recria as opções do <select> de escalão financeiro sempre que o
 * critério (volume/balanço) muda, ou quando o idioma muda (os textos
 * das opções são traduzidos). Guarda o valor selecionado antes de
 * reconstruir a lista e tenta repô-lo a seguir — os valores ('micro',
 * 'pequena'...) são iguais nos dois critérios, por isso a seleção do
 * utilizador não se perde ao trocar de critério, só o texto à frente
 * muda.
 */
function popularEscalaoFinanceiro() {
  const select = document.getElementById('escalao-financeiro');
  const valorAnterior = select.value;
  select.innerHTML = ESCALOES[criterioAtivo()]
    .map(op => `<option value="${op.valor}">${t(op.chave)}</option>`)
    .join('');
  if (valorAnterior) select.value = valorAnterior;
}

/**
 * Classificação final da empresa (ver classificacaoSME em data.js para a
 * regra completa). Devolve null se ainda faltar preencher colaboradores
 * ou escalão financeiro, para quem chama distinguir "ainda não é
 * possível calcular" de "calculado, e é grande".
 */
function classificacaoAtual() {
  const colaboradoresVal = document.getElementById('colaboradores').value;
  const escalao = document.getElementById('escalao-financeiro').value;
  if (!colaboradoresVal || !escalao) return null;
  return classificacaoSME(Number(colaboradoresVal), escalao);
}

/**
 * Atualiza o selo com a classificação estimada (ex: "Pequena empresa") e
 * mostra/esconde o aviso de bloqueio quando a classificação é "grande"
 * (ou seja, acima dos limiares de PME — este framework não se aplica).
 * Chamada sempre que colaboradores ou escalão financeiro mudam, e também
 * quando o idioma muda (para o texto do selo/aviso ficar traduzido).
 */
function atualizarClassificacaoSME() {
  const badge = document.getElementById('classificacao-sme');
  const aviso = document.getElementById('aviso-nao-pme');
  const tierFinal = classificacaoAtual();

  if (!tierFinal) {
    badge.hidden = true;
    aviso.hidden = true;
    return;
  }

  badge.textContent = t(`classificacao-${tierFinal}`);
  badge.hidden = false;
  aviso.hidden = tierFinal !== 'grande';
}

/**
 * Decide se o botão "Seguinte" do Passo 1 pode ficar ativo. Duas
 * condições têm de se verificar ao mesmo tempo:
 *   1. Os campos obrigatórios estão preenchidos (setor, colaboradores,
 *      escalão, e a região — só quando o país é Portugal).
 *   2. A empresa não pode estar classificada como "grande" — este
 *      framework destina-se especificamente a PME.
 * Chamada depois de qualquer alteração relevante nos campos do Passo 1.
 */
function validarPasso1() {
  const setor = document.getElementById('setor').value;
  const colaboradores = document.getElementById('colaboradores').value;
  const escalao = document.getElementById('escalao-financeiro').value;
  const pais = document.getElementById('pais').value;
  const regiao = document.getElementById('regiao').value;
  const regiaoOk = pais !== 'pt' || regiao !== ''; // região só é obrigatória para empresas em Portugal
  const naoPME = classificacaoAtual() === 'grande';
  document.getElementById('ir-passo-2').disabled = !(setor && colaboradores !== '' && escalao && regiaoOk) || naoPME;
}

/** Mostra o campo de Região (NUTS II) só quando o país é Portugal — para empresas de outros países europeus, não faz sentido pedir uma região portuguesa. */
function atualizarVisibilidadeRegiao() {
  const pais = document.getElementById('pais').value;
  document.getElementById('campo-regiao').hidden = pais !== 'pt';
}

/** Lê os campos do Passo 1 e grava tudo no estado partilhado, para ficar disponível ao longo do resto da sessão (e no resumo final). */
function guardarPerfilEmpresa() {
  const estado = lerEstado();
  estado.perfilEmpresa = {
    setor: document.getElementById('setor').value,
    colaboradores: Number(document.getElementById('colaboradores').value),
    criterioFinanceiro: criterioAtivo(),
    escalaoFinanceiro: document.getElementById('escalao-financeiro').value,
    pais: document.getElementById('pais').value,
    // A região só se grava se o país for Portugal — evita guardar lixo
    // (o valor de um <select> que está escondido) quando não se aplica.
    regiao: document.getElementById('pais').value === 'pt' ? document.getElementById('regiao').value : ''
  };
  guardarEstado(estado);
}

/** Repõe o formulário do Passo 1 em branco (botão "Limpar respostas"), incluindo o estado guardado — não só o que está visível no ecrã. */
function limparPerfil() {
  document.getElementById('setor').value = '';
  document.getElementById('colaboradores').value = '';
  document.querySelector('input[name="criterio-financeiro"][value="volume"]').checked = true;
  popularEscalaoFinanceiro();
  document.getElementById('escalao-financeiro').selectedIndex = 0;
  document.getElementById('pais').value = 'pt';
  atualizarVisibilidadeRegiao();
  document.getElementById('regiao').value = '';
  document.getElementById('classificacao-sme').hidden = true;

  const estado = lerEstado();
  estado.perfilEmpresa = {};
  guardarEstado(estado);

  validarPasso1();
}

/**
 * Se já existir um perfil guardado (por exemplo, o utilizador saiu e
 * voltou à página), repõe os valores nos campos do formulário. Se nunca
 * tiver sido preenchido nada (perfil.setor vazio), não faz nada — o
 * formulário fica como está no HTML por defeito.
 */
function restaurarPerfilEmpresa() {
  const perfil = lerEstado().perfilEmpresa;
  if (!perfil || !perfil.setor) return;
  document.getElementById('setor').value = perfil.setor || '';
  document.getElementById('colaboradores').value = perfil.colaboradores ?? '';
  const radio = document.querySelector(`input[name="criterio-financeiro"][value="${perfil.criterioFinanceiro}"]`);
  if (radio) radio.checked = true;
  popularEscalaoFinanceiro();
  if (perfil.escalaoFinanceiro) document.getElementById('escalao-financeiro').value = perfil.escalaoFinanceiro;
  document.getElementById('pais').value = perfil.pais || 'pt';
  atualizarVisibilidadeRegiao();
  document.getElementById('regiao').value = perfil.regiao || '';
  atualizarClassificacaoSME();
  validarPasso1();
}

/** Desenha a grelha do Passo 2: um cartão por bloco do BMC, com nome e descrição em linguagem simples (para orientar quem vai responder ao Instrumento 1, que pressupõe já se saber o que é cada bloco). */
function renderGrelhaBMC() {
  document.getElementById('grelha-bmc').innerHTML = BMC_BLOCOS.map(bloco => {
    const conteudo = tBloco(bloco);
    return `
      <div class="bloco-exp">
        <span class="area-tag">${tArea(bloco.area)}</span>
        <h4>${conteudo.nome}</h4>
        <p>${conteudo.descricao}</p>
      </div>`;
  }).join('');
}

/** Troca de passo (1, 2 ou 3): esconde as outras secções, atualiza os pontinhos de progresso, e sobe a página ao topo — sem isto, quem estivesse a meio do Passo 1 via o Passo 2 começar a meio do ecrã. */
function irParaPasso(n) {
  [1, 2, 3].forEach(i => {
    document.getElementById(`passo-${i}`).hidden = i !== n;
    const dot = document.getElementById(`passo-dot-${i}`);
    dot.classList.toggle('ativo', i === n);
    dot.classList.toggle('concluido', i < n);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/** Mini-mapa do cabeçalho: reflete o diagnóstico do Instrumento 1, se já existir (ex: utilizador voltou ao index depois de já ter respondido). Mesma lógica das outras páginas — ver o comentário em instrumento1.js para a razão do "else". */
function atualizarMapa() {
  const estadoAtual = lerEstado();
  const celulas = document.querySelectorAll('#mapa i');
  BMC_BLOCOS.forEach((bloco, idx) => {
    if (!celulas[idx]) return;
    const resultado = estadoAtual.diagnostico[bloco.id];
    if (resultado) {
      celulas[idx].classList.add('preenchido');
      celulas[idx].setAttribute('data-p', resultado.prioridade);
    } else {
      celulas[idx].classList.remove('preenchido');
      celulas[idx].removeAttribute('data-p');
    }
  });
}

// --- Passo 1: validação em tempo real conforme o utilizador preenche ---
document.getElementById('setor').addEventListener('change', validarPasso1);
document.getElementById('colaboradores').addEventListener('input', () => { atualizarClassificacaoSME(); validarPasso1(); });
document.getElementById('escalao-financeiro').addEventListener('change', () => { atualizarClassificacaoSME(); validarPasso1(); });
document.querySelectorAll('input[name="criterio-financeiro"]').forEach(input => {
  input.addEventListener('change', () => { popularEscalaoFinanceiro(); atualizarClassificacaoSME(); validarPasso1(); });
});
document.getElementById('pais').addEventListener('change', () => { atualizarVisibilidadeRegiao(); validarPasso1(); });
document.getElementById('regiao').addEventListener('change', validarPasso1);

document.getElementById('limpar-perfil').addEventListener('click', () => {
  if (confirm(t('perfil-limpar-confirmar'))) limparPerfil();
});

document.getElementById('ir-passo-2').addEventListener('click', () => {
  guardarPerfilEmpresa();
  renderGrelhaBMC();
  irParaPasso(2);
});

document.getElementById('voltar-passo-1').addEventListener('click', () => irParaPasso(1));
document.getElementById('ir-passo-3').addEventListener('click', () => irParaPasso(3));
document.getElementById('voltar-passo-2').addEventListener('click', () => irParaPasso(2));

// --- Passo 3: consentimento obrigatório antes de poder começar o diagnóstico ---
const checkbox = document.getElementById('consentimento');
const botaoIniciar = document.getElementById('iniciar');

checkbox.addEventListener('change', () => {
  botaoIniciar.disabled = !checkbox.checked;
});

botaoIniciar.addEventListener('click', () => {
  const estado = lerEstado();
  estado.consentimento = true;
  guardarEstado(estado);
  window.location.href = 'instrumento1.html';
});

// Quando o idioma muda, o texto dos campos com data-i18n trata-se sozinho
// (aplicarTraducoes, em i18n.js) — mas o conteúdo gerado por JavaScript
// (as opções do escalão financeiro, o selo de classificação, a grelha do
// BMC) tem de ser reconstruído manualmente, por isso este listener.
document.addEventListener('idioma:alterado', () => {
  popularEscalaoFinanceiro();
  atualizarClassificacaoSME();
  renderGrelhaBMC();
});

// Arranque da página: prepara o dropdown de escalão, ajusta a
// visibilidade da região consoante o país por omissão (Portugal), repõe
// um perfil anterior se existir, e pinta o mini-mapa com o diagnóstico
// (se já tiver sido feito). Não se chama validarPasso1() aqui de
// propósito — o botão "Seguinte" já começa "disabled" no HTML, e só
// precisa de ser reavaliado depois de alguma alteração do utilizador.
popularEscalaoFinanceiro();
atualizarVisibilidadeRegiao();
restaurarPerfilEmpresa();
atualizarMapa();
