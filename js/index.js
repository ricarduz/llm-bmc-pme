/**
 * index.html — três passos: (1) perfil da empresa, (2) grelha explicativa
 * do BMC, (3) instrumentos + consentimento + início.
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

const ORDEM_TIERS = ['micro', 'pequena', 'media', 'grande'];

function criterioAtivo() {
  const input = document.querySelector('input[name="criterio-financeiro"]:checked');
  return input ? input.value : 'volume';
}

function popularEscalaoFinanceiro() {
  const select = document.getElementById('escalao-financeiro');
  const valorAnterior = select.value;
  select.innerHTML = ESCALOES[criterioAtivo()]
    .map(op => `<option value="${op.valor}">${t(op.chave)}</option>`)
    .join('');
  if (valorAnterior) select.value = valorAnterior;
}

function tierPorColaboradores(n) {
  if (n < 10) return 'micro';
  if (n < 50) return 'pequena';
  if (n < 250) return 'media';
  return 'grande';
}

function classificacaoAtual() {
  const colaboradoresVal = document.getElementById('colaboradores').value;
  const escalao = document.getElementById('escalao-financeiro').value;
  if (!colaboradoresVal || !escalao) return null;
  const tierStaff = tierPorColaboradores(Number(colaboradoresVal));
  return ORDEM_TIERS[Math.max(ORDEM_TIERS.indexOf(tierStaff), ORDEM_TIERS.indexOf(escalao))];
}

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

function validarPasso1() {
  const setor = document.getElementById('setor').value;
  const colaboradores = document.getElementById('colaboradores').value;
  const escalao = document.getElementById('escalao-financeiro').value;
  const pais = document.getElementById('pais').value;
  const regiao = document.getElementById('regiao').value;
  const regiaoOk = pais !== 'pt' || regiao !== '';
  const naoPME = classificacaoAtual() === 'grande';
  document.getElementById('ir-passo-2').disabled = !(setor && colaboradores !== '' && escalao && regiaoOk) || naoPME;
}

function atualizarVisibilidadeRegiao() {
  const pais = document.getElementById('pais').value;
  document.getElementById('campo-regiao').hidden = pais !== 'pt';
}

function guardarPerfilEmpresa() {
  const estado = lerEstado();
  estado.perfilEmpresa = {
    setor: document.getElementById('setor').value,
    colaboradores: Number(document.getElementById('colaboradores').value),
    criterioFinanceiro: criterioAtivo(),
    escalaoFinanceiro: document.getElementById('escalao-financeiro').value,
    pais: document.getElementById('pais').value,
    regiao: document.getElementById('pais').value === 'pt' ? document.getElementById('regiao').value : ''
  };
  guardarEstado(estado);
}

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

function irParaPasso(n) {
  [1, 2, 3].forEach(i => {
    document.getElementById(`passo-${i}`).hidden = i !== n;
    const dot = document.getElementById(`passo-dot-${i}`);
    dot.classList.toggle('ativo', i === n);
    dot.classList.toggle('concluido', i < n);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

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

document.addEventListener('idioma:alterado', () => {
  popularEscalaoFinanceiro();
  atualizarClassificacaoSME();
  renderGrelhaBMC();
});

popularEscalaoFinanceiro();
atualizarVisibilidadeRegiao();
restaurarPerfilEmpresa();
