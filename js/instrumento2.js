const estado2 = lerEstado();

const blocosElegiveis = BMC_BLOCOS.filter(b => {
  const resultado = estado2.diagnostico[b.id];
  return resultado && (resultado.prioridade === 'Prioritário' || resultado.prioridade === 'Relevante');
}).sort((a, b) => {
  const ordem = { 'Prioritário': 0, 'Relevante': 1 };
  return ordem[estado2.diagnostico[a.id].prioridade] - ordem[estado2.diagnostico[b.id].prioridade];
});

function listaMatriz(itens) {
  return `<ul style="margin:0; padding-left:18px;">${itens.map(i => `<li>${i}</li>`).join('')}</ul>`;
}

function renderBlocoMatriz(bloco) {
  const resultado = estado2.diagnostico[bloco.id];
  const conteudo = tBloco(bloco);
  const selecionado = estado2.blocosSelecionados.includes(bloco.id);

  return `
    <div class="cartao">
      <div class="cartao-cabecalho">
        <div>
          <span class="area-tag">${tArea(bloco.area)}${bloco.ficha ? t('i1-com-ficha') : ''}</span>
          <h3>${conteudo.nome}</h3>
        </div>
        <span class="selo" data-p="${resultado.prioridade}">${tPrioridade(resultado.prioridade)}</span>
      </div>

      <table>
        <thead><tr><th>${t('th-aplicacoes')}</th><th>${t('th-oportunidades')}</th><th>${t('th-riscos')}</th></tr></thead>
        <tbody>
          <tr>
            <td>${listaMatriz(conteudo.matriz.aplicacoes)}</td>
            <td>${listaMatriz(conteudo.matriz.oportunidades)}</td>
            <td>${listaMatriz(conteudo.matriz.riscos)}</td>
          </tr>
        </tbody>
      </table>

      <label style="display:flex; gap:10px; align-items:center; margin-top:16px; cursor:${bloco.ficha ? 'pointer' : 'not-allowed'};">
        <input type="checkbox" data-bloco="${bloco.id}" ${selecionado ? 'checked' : ''} ${bloco.ficha ? '' : 'disabled'}>
        <span>${bloco.ficha ? t('i2-aprofundar') : t('i2-sem-ficha')}</span>
      </label>
    </div>
  `;
}

function render() {
  if (blocosElegiveis.length === 0) {
    document.getElementById('sem-blocos').hidden = false;
    document.getElementById('continuar').textContent = t('i2-continuar-sintese');
    document.getElementById('limpar').hidden = true;
    return;
  }

  document.getElementById('lista-blocos').innerHTML = blocosElegiveis.map(renderBlocoMatriz).join('');

  document.querySelectorAll('input[data-bloco]').forEach(input => {
    input.addEventListener('change', () => {
      const atual = lerEstado();
      const id = input.dataset.bloco;
      if (input.checked) {
        if (!atual.blocosSelecionados.includes(id)) atual.blocosSelecionados.push(id);
      } else {
        atual.blocosSelecionados = atual.blocosSelecionados.filter(b => b !== id);
      }
      guardarEstado(atual);
    });
  });
}

function atualizarMapa() {
  const celulas = document.querySelectorAll('#mapa i');
  BMC_BLOCOS.forEach((bloco, idx) => {
    const resultado = estado2.diagnostico[bloco.id];
    if (resultado && celulas[idx]) {
      celulas[idx].classList.add('preenchido');
      celulas[idx].setAttribute('data-p', resultado.prioridade);
    }
  });
}

document.getElementById('continuar').addEventListener('click', () => {
  const semFichaDisponivel = blocosElegiveis.length === 0 ||
    lerEstado().blocosSelecionados.filter(id => BMC_BLOCOS.find(b => b.id === id)?.ficha).length === 0;
  window.location.href = semFichaDisponivel ? 'resultados.html' : 'instrumento3.html';
});

document.getElementById('limpar').addEventListener('click', () => {
  if (confirm(t('i2-limpar-confirmar'))) {
    limparSelecao();
    estado2.blocosSelecionados = [];
    document.querySelectorAll('input[data-bloco]').forEach(input => { input.checked = false; });
  }
});

document.addEventListener('idioma:alterado', render);

render();
atualizarMapa();
