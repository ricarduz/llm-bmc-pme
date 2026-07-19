const estado = lerEstado();

function opcoesEscala(blocoId, eixo, definicoes) {
  return [1, 2, 3].map(v => `
    <label>
      <input type="radio" name="${blocoId}-${eixo}" value="${v}"
        ${estado.diagnostico[blocoId] && estado.diagnostico[blocoId][eixo] == v ? 'checked' : ''}>
      <span><strong>${v}</strong> — ${definicoes[v]}</span>
    </label>
  `).join('');
}

function renderBloco(bloco) {
  const guardado = estado.diagnostico[bloco.id];
  return `
    <div class="cartao" id="cartao-${bloco.id}">
      <div class="cartao-cabecalho">
        <div>
          <span class="area-tag">${AREAS[bloco.area]}${bloco.ficha ? ' · com Ficha de Decisão' : ''}</span>
          <h3>${bloco.nome}</h3>
        </div>
        <span class="selo" id="selo-${bloco.id}" ${guardado ? `data-p="${guardado.prioridade}"` : ''}>
          ${guardado ? guardado.prioridade : 'por avaliar'}
        </span>
      </div>

      <ul class="indicadores">
        ${bloco.indicadores.map(i => `<li>${i}</li>`).join('')}
      </ul>

      <div class="eixo">
        <div class="eixo-titulo">Prontidão — em que medida a PME dispõe destas condições?</div>
        <div class="escala">${opcoesEscala(bloco.id, 'prontidao', PRONTIDAO_DEF)}</div>
      </div>

      <div class="eixo">
        <div class="eixo-titulo">Impacto — quão crítico é este bloco para o desempenho atual?</div>
        <div class="escala">${opcoesEscala(bloco.id, 'impacto', IMPACTO_DEF)}</div>
      </div>
    </div>
  `;
}

function render() {
  document.getElementById('lista-blocos').innerHTML =
    BMC_BLOCOS.map(renderBloco).join('');

  BMC_BLOCOS.forEach(bloco => {
    document.querySelectorAll(`input[name="${bloco.id}-prontidao"], input[name="${bloco.id}-impacto"]`)
      .forEach(input => input.addEventListener('change', () => onMudanca(bloco.id)));
  });

  atualizarProgresso();
  atualizarMapa();
}

function onMudanca(blocoId) {
  const prontidaoInput = document.querySelector(`input[name="${blocoId}-prontidao"]:checked`);
  const impactoInput = document.querySelector(`input[name="${blocoId}-impacto"]:checked`);

  if (prontidaoInput && impactoInput) {
    const prontidao = Number(prontidaoInput.value);
    const impacto = Number(impactoInput.value);
    atualizarDiagnostico(blocoId, prontidao, impacto);

    const prioridade = classificarBloco(prontidao, impacto);
    const selo = document.getElementById(`selo-${blocoId}`);
    selo.textContent = prioridade;
    selo.setAttribute('data-p', prioridade);
  }

  atualizarProgresso();
  atualizarMapa();
}

function atualizarProgresso() {
  const estadoAtual = lerEstado();
  const avaliados = Object.keys(estadoAtual.diagnostico).length;
  document.getElementById('progresso').textContent = `${avaliados} de ${BMC_BLOCOS.length} blocos avaliados`;
  document.getElementById('continuar').disabled = avaliados < BMC_BLOCOS.length;
}

function atualizarMapa() {
  const estadoAtual = lerEstado();
  const celulas = document.querySelectorAll('#mapa i');
  BMC_BLOCOS.forEach((bloco, idx) => {
    const resultado = estadoAtual.diagnostico[bloco.id];
    if (resultado && celulas[idx]) {
      celulas[idx].classList.add('preenchido');
      celulas[idx].setAttribute('data-p', resultado.prioridade);
    }
  });
}

document.getElementById('continuar').addEventListener('click', () => {
  window.location.href = 'instrumento2.html';
});

render();
