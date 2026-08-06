/**
 * Instrumento 2 — Matriz LLM × BMC.
 *
 * Ao contrário do Instrumento 1, aqui não há nada para "avançar passo a
 * passo": mostram-se logo todos os blocos elegíveis (os que saíram do
 * diagnóstico como Prioritário ou Relevante), cada um com a sua matriz de
 * Aplicações/Oportunidades/Riscos, e o utilizador escolhe quais quer
 * aprofundar no Instrumento 3 através de checkboxes.
 */

// Lido uma única vez ao carregar a página — o diagnóstico só se edita no
// Instrumento 1, por isso não há necessidade de o voltar a ler aqui.
const estado2 = lerEstado();

/**
 * Só entram nesta lista os blocos que passaram no diagnóstico como
 * Prioritário ou Relevante — "Diferir" e "Investimento necessário" ficam
 * de fora de propósito (ver Instrumento 1: um bloco com prontidão
 * insuficiente ou impacto baixo não avança para a Matriz). Ordenados com
 * os Prioritário primeiro, para chamarem mais a atenção.
 */
const blocosElegiveis = BMC_BLOCOS.filter(b => {
  const resultado = estado2.diagnostico[b.id];
  return resultado && (resultado.prioridade === 'Prioritário' || resultado.prioridade === 'Relevante');
}).sort((a, b) => {
  const ordem = { 'Prioritário': 0, 'Relevante': 1 };
  return ordem[estado2.diagnostico[a.id].prioridade] - ordem[estado2.diagnostico[b.id].prioridade];
});

/** Pequeno utilitário para transformar um array de strings numa lista <ul> — repete-se três vezes por bloco (aplicações/oportunidades/riscos), por isso vale a pena ser função. */
function listaMatriz(itens) {
  return `<ul style="margin:0; padding-left:18px;">${itens.map(i => `<li>${i}</li>`).join('')}</ul>`;
}

/**
 * Um cartão por bloco elegível: o selo de prioridade, a tabela da matriz,
 * e uma checkbox para escolher aprofundar no Instrumento 3 — só ativa
 * para blocos que tenham mesmo uma Ficha de Decisão disponível (bloco.ficha).
 * Os outros mostram a checkbox desativada com uma explicação, em vez de
 * simplesmente a esconder — para ficar claro que a Matriz é mesmo o nível
 * máximo de detalhe para aquele bloco, não que falta alguma coisa.
 */
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

/**
 * Se não houver nenhum bloco elegível (diagnóstico todo "Diferir" ou
 * "Investimento necessário"), mostra-se uma mensagem em vez da lista, e
 * o botão "Continuar" passa a ir direto para a síntese — não faz
 * sentido pedir para escolher blocos a aprofundar se não há nenhum.
 */
function render() {
  if (blocosElegiveis.length === 0) {
    document.getElementById('lead-i2').hidden = true;
    document.getElementById('sem-blocos').hidden = false;
    document.getElementById('continuar').textContent = t('i2-continuar-sintese');
    return;
  }

  document.getElementById('lead-i2').hidden = false;
  document.getElementById('lista-blocos').innerHTML = blocosElegiveis.map(renderBlocoMatriz).join('');

  // Se nenhum dos blocos elegíveis tiver Ficha de Decisão disponível
  // (todas as checkboxes ficam desativadas), não faz sentido o botão
  // dizer "Continuar para o Instrumento 3" — vai direto para a síntese.
  const algumComFicha = blocosElegiveis.some(b => b.ficha);
  document.getElementById('continuar').textContent = algumComFicha ? t('i2-continuar-fichas') : t('i2-continuar-sintese');

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

/**
 * Pinta a mini-grelha do cabeçalho com o resultado do diagnóstico.
 * Percorre sempre todos os 9 blocos (não só os elegíveis) para também
 * limpar células sem resultado — mesma lógica do Instrumento 1, para não
 * ficarem células "presas" com a cor de uma sessão anterior.
 */
function atualizarMapa() {
  const celulas = document.querySelectorAll('#mapa i');
  BMC_BLOCOS.forEach((bloco, idx) => {
    if (!celulas[idx]) return;
    const resultado = estado2.diagnostico[bloco.id];
    if (resultado) {
      celulas[idx].classList.add('preenchido');
      celulas[idx].setAttribute('data-p', resultado.prioridade);
    } else {
      celulas[idx].classList.remove('preenchido');
      celulas[idx].removeAttribute('data-p');
    }
  });
}

/**
 * "Continuar" só vai para o Instrumento 3 se houver pelo menos um bloco
 * selecionado que tenha mesmo Ficha de Decisão disponível — caso
 * contrário, salta direto para a síntese (não faz sentido mostrar um
 * Instrumento 3 vazio). O `?.ficha` é uma proteção extra: na prática,
 * blocosSelecionados só pode conter blocos com ficha (a checkbox dos
 * outros vem sempre desativada), mas o find() podia teoricamente devolver
 * undefined se o id não existisse em BMC_BLOCOS, daí o optional chaining.
 */
document.getElementById('continuar').addEventListener('click', () => {
  const semFichaDisponivel = blocosElegiveis.length === 0 ||
    lerEstado().blocosSelecionados.filter(id => BMC_BLOCOS.find(b => b.id === id)?.ficha).length === 0;
  window.location.href = semFichaDisponivel ? 'resultados.html' : 'instrumento3.html';
});

document.addEventListener('idioma:alterado', render);

render();
atualizarMapa();
