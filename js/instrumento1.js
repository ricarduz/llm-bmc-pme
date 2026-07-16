/**
 * Instrumento 1 — percurso progressivo: os blocos abrem um a um, por
 * ordem, à medida que o anterior fica respondido. Blocos já respondidos
 * podem ser reabertos para edição (clicando no resumo colapsado); os
 * blocos ainda não alcançados aparecem bloqueados.
 */

let blocoExpandidoId = null;

function opcoesEscala(blocoId, eixo, valores) {
  const estadoAtual = lerEstado();
  return [1, 2, 3].map(v => `
    <label>
      <input type="radio" name="${blocoId}-${eixo}" value="${v}"
        ${estadoAtual.diagnostico[blocoId] && estadoAtual.diagnostico[blocoId][eixo] == v ? 'checked' : ''}>
      <span><strong>${v}</strong> — ${valores[v]}</span>
    </label>
  `).join('');
}

function renderBlocoExpandido(bloco, guardado) {
  const conteudo = tBloco(bloco);
  const prontidaoValores = { 1: tEscala('prontidao', 1), 2: tEscala('prontidao', 2), 3: tEscala('prontidao', 3) };
  const impactoValores = { 1: tEscala('impacto', 1), 2: tEscala('impacto', 2), 3: tEscala('impacto', 3) };

  return `
    <div class="cartao" id="cartao-${bloco.id}">
      <div class="cartao-cabecalho">
        <div>
          <span class="area-tag">${tArea(bloco.area)}${bloco.ficha ? t('i1-com-ficha') : ''}</span>
          <h3>${conteudo.nome}</h3>
        </div>
        <span class="selo" id="selo-${bloco.id}" ${guardado ? `data-p="${guardado.prioridade}"` : ''}>
          ${guardado ? tPrioridade(guardado.prioridade) : t('i1-por-avaliar')}
        </span>
      </div>

      <ul class="indicadores">
        ${conteudo.indicadores.map(i => `<li>${i}</li>`).join('')}
      </ul>

      <div class="eixo">
        <div class="eixo-titulo">${t('i1-eixo-prontidao')}</div>
        <div class="escala">${opcoesEscala(bloco.id, 'prontidao', prontidaoValores)}</div>
      </div>

      <div class="eixo">
        <div class="eixo-titulo">${t('i1-eixo-impacto')}</div>
        <div class="escala">${opcoesEscala(bloco.id, 'impacto', impactoValores)}</div>
      </div>
    </div>
  `;
}

function renderBlocoColapsado(bloco, guardado) {
  const conteudo = tBloco(bloco);
  return `
    <div class="cartao cartao-colapsado" data-expandir="${bloco.id}" tabindex="0" role="button">
      <div class="cartao-cabecalho">
        <div>
          <span class="area-tag">${tArea(bloco.area)}${bloco.ficha ? t('i1-com-ficha') : ''}</span>
          <h3>${conteudo.nome}</h3>
        </div>
        <span class="selo" ${guardado ? `data-p="${guardado.prioridade}"` : ''}>
          ${guardado ? tPrioridade(guardado.prioridade) : t('i1-por-avaliar')}
        </span>
      </div>
    </div>
  `;
}

function renderBlocoBloqueado(bloco) {
  const conteudo = tBloco(bloco);
  return `
    <div class="cartao cartao-bloqueado">
      <div class="cartao-cabecalho">
        <div>
          <span class="area-tag">${tArea(bloco.area)}</span>
          <h3>${conteudo.nome}</h3>
        </div>
        <span class="selo-cadeado" aria-hidden="true">&#128274;</span>
      </div>
    </div>
  `;
}

function calcularVisao(estadoAtual) {
  const proximo = BMC_BLOCOS.find(b => !estadoAtual.diagnostico[b.id]);
  const idAtual = proximo ? proximo.id : null;
  const indiceAtual = idAtual ? BMC_BLOCOS.findIndex(b => b.id === idAtual) : BMC_BLOCOS.length;

  let idExpandido = blocoExpandidoId;
  const indiceExpandido = idExpandido ? BMC_BLOCOS.findIndex(b => b.id === idExpandido) : -1;
  if (idExpandido === null || indiceExpandido > indiceAtual) idExpandido = idAtual;

  return { indiceAtual, idExpandido };
}

function render() {
  const estadoAtual = lerEstado();
  const { indiceAtual, idExpandido } = calcularVisao(estadoAtual);

  document.getElementById('lista-blocos').innerHTML = BMC_BLOCOS.map((bloco, idx) => {
    const guardado = estadoAtual.diagnostico[bloco.id];
    if (idx > indiceAtual) return renderBlocoBloqueado(bloco);
    if (bloco.id === idExpandido) return renderBlocoExpandido(bloco, guardado);
    return renderBlocoColapsado(bloco, guardado);
  }).join('');

  attachListeners();
  atualizarProgresso();
  atualizarMapa();
}

function attachListeners() {
  document.querySelectorAll('[data-expandir]').forEach(el => {
    const irParaBloco = () => {
      blocoExpandidoId = el.dataset.expandir;
      render();
    };
    el.addEventListener('click', irParaBloco);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        irParaBloco();
      }
    });
  });

  BMC_BLOCOS.forEach(bloco => {
    document.querySelectorAll(`input[name="${bloco.id}-prontidao"], input[name="${bloco.id}-impacto"]`)
      .forEach(input => input.addEventListener('change', () => onMudanca(bloco.id)));
  });
}

function onMudanca(blocoId) {
  const prontidaoInput = document.querySelector(`input[name="${blocoId}-prontidao"]:checked`);
  const impactoInput = document.querySelector(`input[name="${blocoId}-impacto"]:checked`);

  if (prontidaoInput && impactoInput) {
    atualizarDiagnostico(blocoId, Number(prontidaoInput.value), Number(impactoInput.value));
    blocoExpandidoId = null; // liberta o "atual" para avançar automaticamente
    render();
  }
}

function atualizarProgresso() {
  const estadoAtual = lerEstado();
  const avaliados = Object.keys(estadoAtual.diagnostico).length;
  document.getElementById('progresso').textContent = `${avaliados}${t('i1-progresso')}`;

  const completo = avaliados === BMC_BLOCOS.length;
  document.getElementById('continuar').disabled = !completo;
  document.getElementById('resumo-final').hidden = !completo;
  if (completo) renderResumo(estadoAtual);
}

function renderResumo(estadoAtual) {
  const linhas = BMC_BLOCOS.map(bloco => {
    const r = estadoAtual.diagnostico[bloco.id];
    return `
      <tr>
        <td>${tBloco(bloco).nome}</td>
        <td>${r.prontidao}</td>
        <td>${r.impacto}</td>
        <td><span class="selo" data-p="${r.prioridade}">${tPrioridade(r.prioridade)}</span></td>
      </tr>`;
  }).join('');

  document.getElementById('tabela-resumo').innerHTML = `
    <thead><tr><th>${t('th-bloco')}</th><th>${t('th-prontidao')}</th><th>${t('th-impacto')}</th><th>${t('th-prioridade')}</th></tr></thead>
    <tbody>${linhas}</tbody>
  `;
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

document.getElementById('limpar').addEventListener('click', () => {
  if (confirm(t('i1-limpar-confirmar'))) {
    limparDiagnostico();
    blocoExpandidoId = null;
    render();
  }
});

document.addEventListener('idioma:alterado', render);

render();
