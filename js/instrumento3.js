const estado3 = lerEstado();

const idsSelecionados = estado3.blocosSelecionados.filter(id => FICHAS[id]);

function renderFichaCompleta(bloco, ficha) {
  return `
    <div class="cartao">
      <div class="cartao-cabecalho">
        <div>
          <span class="area-tag">${ficha.area} · ${ficha.requisitos}</span>
          <h2 style="margin-bottom:0;">Ficha de Decisão — ${ficha.titulo}</h2>
        </div>
        <span class="selo" data-p="${estado3.diagnostico[bloco.id].prioridade}">${estado3.diagnostico[bloco.id].prioridade}</span>
      </div>

      <h3>1. Contexto do bloco</h3>
      <p>${ficha.contexto}</p>

      <h3>2. Aplicações LLM prioritárias</h3>
      <ul>${ficha.aplicacoes.map(a => `<li>${a}</li>`).join('')}</ul>

      <h3>3. Orientação tecnológica</h3>
      <table>
        <thead><tr><th>Opção</th><th>Adequada quando</th><th>Considerações para PME</th></tr></thead>
        <tbody>
          ${ficha.orientacaoTecnologica.map(o => `
            <tr><td>${o.opcao}</td><td>${o.quando}</td><td>${o.consideracoes}</td></tr>
          `).join('')}
        </tbody>
      </table>

      <h3 style="margin-top:20px;">4. Ações concretas</h3>
      <ul>${ficha.acoes.map(a => `<li>${a}</li>`).join('')}</ul>

      <h3>5. Critérios de avaliação</h3>
      <table>
        <thead><tr><th>Critério</th><th>Indicador de impacto</th></tr></thead>
        <tbody>
          ${ficha.criterios.map(c => `<tr><td>${c.criterio}</td><td>${c.indicador}</td></tr>`).join('')}
        </tbody>
      </table>

      <h3 style="margin-top:20px;">6. Conformidade e governança</h3>
      <p>${ficha.governanca}</p>
    </div>
  `;
}

function renderFichaPendente(bloco, ficha) {
  return `
    <div class="cartao">
      <div class="cartao-cabecalho">
        <div>
          <span class="area-tag">${ficha.area}</span>
          <h2 style="margin-bottom:0;">Ficha de Decisão — ${ficha.titulo}</h2>
        </div>
        <span class="marcador-pendente">conteúdo a integrar</span>
      </div>
      <p class="nota">
        As seis secções desta ficha (contexto, aplicações, orientação
        tecnológica, ações concretas, critérios de avaliação, conformidade)
        seguem a mesma estrutura da Ficha de Recursos-Chave e serão
        confirmadas contra o Apêndice de Instrumentos.
      </p>
    </div>
  `;
}

function render() {
  if (idsSelecionados.length === 0) {
    document.getElementById('lista-fichas').innerHTML = `
      <div class="cartao">
        <p class="nota">Nenhum bloco com Ficha de Decisão foi selecionado no Instrumento 2. Pode <a href="instrumento2.html">rever a seleção</a> ou avançar para a síntese.</p>
      </div>`;
    return;
  }

  document.getElementById('lista-fichas').innerHTML = idsSelecionados.map(id => {
    const bloco = BMC_BLOCOS.find(b => b.id === id);
    const ficha = FICHAS[id];
    return ficha.pendente ? renderFichaPendente(bloco, ficha) : renderFichaCompleta(bloco, ficha);
  }).join('');
}

function atualizarMapa() {
  const celulas = document.querySelectorAll('#mapa i');
  BMC_BLOCOS.forEach((bloco, idx) => {
    const resultado = estado3.diagnostico[bloco.id];
    if (resultado && celulas[idx]) {
      celulas[idx].classList.add('preenchido');
      celulas[idx].setAttribute('data-p', resultado.prioridade);
    }
  });
}

document.getElementById('continuar').addEventListener('click', () => {
  window.location.href = 'resultados.html';
});

render();
atualizarMapa();
