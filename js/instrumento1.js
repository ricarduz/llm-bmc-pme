/**
 * Instrumento 1 — Diagnóstico de Pré-requisitos.
 *
 * A ideia central: os 9 blocos do BMC não aparecem todos abertos de
 * uma vez. Abrem um a um, por ordem, e só o bloco atual (o primeiro
 * ainda por responder) fica com os controlos visíveis; os seguintes
 * ficam "bloqueados" (cadeado), e os já respondidos ficam "colapsados"
 * num resumo que se pode reabrir para corrigir.
 *
 * Isto dá três estados possíveis por bloco em cada render():
 *   bloqueado   → ainda não se chegou lá (índice maior do que o atual)
 *   expandido   → o bloco a ser respondido agora (inputs visíveis)
 *   colapsado   → já respondido, mas não é o que está a ser editado
 */

// Se o utilizador clicar num bloco já respondido para o rever/editar, o
// id fica guardado aqui. Enquanto for null, mostra-se sempre o primeiro
// bloco por responder (o comportamento "avança sozinho").
let blocoExpandidoId = null;

/**
 * Gera as três opções (1/2/3) de um eixo (Prontidão ou Impacto) para um
 * bloco, já com o "checked" correto se houver uma resposta guardada.
 * Relê o estado a cada chamada — como isto corre dentro de render(), que
 * já lê o estado uma vez, podia passar-se por parâmetro, mas preferiu-se
 * manter a função independente e simples de reutilizar.
 */
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

/** O bloco "ativo": indicadores de apoio à reflexão + as duas escalas (Prontidão/Impacto) com os radio buttons. */
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

/** Um bloco já respondido, resumido a uma linha (nome + selo de prioridade) — clicável para reabrir e editar a resposta. */
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

/** Um bloco ainda por alcançar: só mostra o nome e um cadeado, sem indicadores nem inputs (não pode ser respondido fora de ordem). */
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

/**
 * Decide, para o estado atual, (a) até que índice os blocos estão
 * desbloqueados (indiceAtual = índice do primeiro por responder, ou o
 * comprimento da lista se estiver tudo respondido) e (b) qual bloco deve
 * aparecer expandido agora (idExpandido).
 *
 * A regra para idExpandido: normalmente é o próprio "atual" (idAtual),
 * mas se o utilizador tiver clicado para rever um bloco anterior já
 * respondido (blocoExpandidoId), respeita-se essa escolha — DESDE QUE
 * esse bloco ainda esteja desbloqueado. O `indiceExpandido > indiceAtual`
 * é uma proteção: se por algum motivo blocoExpandidoId apontar para um
 * bloco à frente do atual (não devia acontecer, mas mais vale prevenir),
 * ignora-se e volta-se a mostrar o bloco atual em vez de rebentar.
 */
function calcularVisao(estadoAtual) {
  const proximo = BMC_BLOCOS.find(b => !estadoAtual.diagnostico[b.id]);
  const idAtual = proximo ? proximo.id : null;
  const indiceAtual = idAtual ? BMC_BLOCOS.findIndex(b => b.id === idAtual) : BMC_BLOCOS.length;

  let idExpandido = blocoExpandidoId;
  const indiceExpandido = idExpandido ? BMC_BLOCOS.findIndex(b => b.id === idExpandido) : -1;
  if (idExpandido === null || indiceExpandido > indiceAtual) idExpandido = idAtual;

  return { indiceAtual, idExpandido };
}

/**
 * Redesenha a lista de blocos do zero, de acordo com o estado atual —
 * chamada sempre que algo muda (resposta dada, bloco reaberto, limpar,
 * ou troca de idioma). Como troca sempre o innerHTML todo, é preciso
 * voltar a ligar os event listeners a seguir (attachListeners) — os
 * antigos morrem com os elementos antigos.
 */
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

  // Centra o bloco ativo no ecrã — sem isto, à medida que os blocos
  // respondidos se vão acumulando (colapsados) acima, o bloco a
  // responder ia ficando cada vez mais abaixo, obrigando a scroll manual.
  const elAtivo = document.getElementById(`cartao-${idExpandido}`);
  if (elAtivo) elAtivo.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/** Liga os cliques/teclado dos resumos colapsados (para reabrir um bloco) e os "change" dos radio buttons do bloco expandido. Corre depois de CADA render(), porque o innerHTML é sempre recriado. */
function attachListeners() {
  document.querySelectorAll('[data-expandir]').forEach(el => {
    const irParaBloco = () => {
      blocoExpandidoId = el.dataset.expandir;
      render();
    };
    el.addEventListener('click', irParaBloco);
    el.addEventListener('keydown', (e) => {
      // Enter e Espaço, para quem navega por teclado — um <div role="button"> não reage a estas teclas sozinho.
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        irParaBloco();
      }
    });
  });

  // Regista-se um listener por cada bloco, mesmo sabendo que só o bloco
  // expandido tem inputs de facto no DOM neste momento — para os
  // restantes, querySelectorAll simplesmente não encontra nada e o
  // forEach não faz nada. Mais simples do que descobrir só o expandido.
  BMC_BLOCOS.forEach(bloco => {
    document.querySelectorAll(`input[name="${bloco.id}-prontidao"], input[name="${bloco.id}-impacto"]`)
      .forEach(input => input.addEventListener('change', () => onMudanca(bloco.id)));
  });
}

/**
 * Chamada sempre que um radio button muda. Só grava e avança quando AMBOS
 * os eixos (Prontidão e Impacto) já têm resposta — se só um estiver
 * escolhido, não faz nada e espera pelo outro.
 * `blocoExpandidoId = null` é o que faz o ecrã avançar sozinho para o
 * bloco seguinte: ao limpar a escolha manual, calcularVisao() volta a
 * mostrar o "atual", que agora já é o bloco a seguir a este.
 */
function onMudanca(blocoId) {
  const prontidaoInput = document.querySelector(`input[name="${blocoId}-prontidao"]:checked`);
  const impactoInput = document.querySelector(`input[name="${blocoId}-impacto"]:checked`);

  if (prontidaoInput && impactoInput) {
    atualizarDiagnostico(blocoId, Number(prontidaoInput.value), Number(impactoInput.value));
    blocoExpandidoId = null;
    render();
  }
}

/** Atualiza o contador "X de 9 blocos avaliados", ativa o botão Continuar e mostra o resumo final quando os 9 estiverem respondidos. */
function atualizarProgresso() {
  const estadoAtual = lerEstado();
  const avaliados = Object.keys(estadoAtual.diagnostico).length;
  document.getElementById('progresso').textContent = `${avaliados}${t('i1-progresso')}`;

  const completo = avaliados === BMC_BLOCOS.length;
  document.getElementById('continuar').disabled = !completo;
  document.getElementById('resumo-final').hidden = !completo;
  if (completo) renderResumo(estadoAtual);
}

/** Tabela com o resultado dos 9 blocos, mostrada só depois de o diagnóstico estar completo. */
function renderResumo(estadoAtual) {
  const linhas = BMC_BLOCOS.map(bloco => {
    const r = estadoAtual.diagnostico[bloco.id];
    return `
      <tr>
        <td data-label="${t('th-bloco')}">${tBloco(bloco).nome}</td>
        <td data-label="${t('th-prontidao')}">${r.prontidao}</td>
        <td data-label="${t('th-impacto')}">${r.impacto}</td>
        <td data-label="${t('th-prioridade')}"><span class="selo" data-p="${r.prioridade}">${tPrioridade(r.prioridade)}</span></td>
      </tr>`;
  }).join('');

  document.getElementById('tabela-resumo').innerHTML = `
    <thead><tr><th>${t('th-bloco')}</th><th>${t('th-prontidao')}</th><th>${t('th-impacto')}</th><th>${t('th-prioridade')}</th></tr></thead>
    <tbody>${linhas}</tbody>
  `;
}

/**
 * Pinta a mini-grelha de 9 quadrados do cabeçalho, um por bloco, com a
 * cor da prioridade já obtida. Percorre sempre TODOS os blocos (não só
 * os respondidos) para também limpar as células que deixaram de ter
 * resposta — sem este "else", depois de "Limpar respostas" a mini-grelha
 * ficava com as cores antigas, porque só se adicionava a classe
 * "preenchido", nunca se removia.
 */
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

/** True quando os 9 blocos estão respondidos e todos saíram como "Diferir" — nesse caso não há razão para passar pelo Instrumento 2 (mostraria só "nenhum bloco elegível") nem pelo Instrumento 3, e vai-se direto para o resultado. */
function todosBlocosDiferir(estadoAtual) {
  const valores = Object.values(estadoAtual.diagnostico);
  return valores.length === BMC_BLOCOS.length && valores.every(v => v.prioridade === 'Diferir');
}

document.getElementById('continuar').addEventListener('click', () => {
  const estadoAtual = lerEstado();
  window.location.href = todosBlocosDiferir(estadoAtual) ? 'resultados.html' : 'instrumento2.html';
});

document.getElementById('limpar').addEventListener('click', () => {
  if (confirm(t('i1-limpar-confirmar'))) {
    limparDiagnostico();
    blocoExpandidoId = null; // sem isto, ao limpar um bloco que estava a ser reaberto para edição, o render() seguinte tentava voltar a mostrá-lo expandido mesmo já sem dados
    render();
  }
});

document.addEventListener('idioma:alterado', render);

render();
