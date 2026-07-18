/**
 * Instrumento 3 — Fichas de Decisão.
 *
 * Só aparecem aqui os blocos que o utilizador escolheu aprofundar no
 * Instrumento 2 (e que tenham mesmo uma Ficha disponível — dos 9 blocos
 * do BMC, só 4 têm ficha: Canais, Relacionamento com Clientes,
 * Atividades-Chave e Recursos-Chave). Quando há mais do que uma
 * selecionada, mostram-se por abas em vez de empilhadas — com 2 ou 3
 * fichas completas (cada uma com 6 secções e várias tabelas), ler tudo
 * de seguida tornava-se confuso.
 *
 * Nota: esta página ainda não tem seletor de idioma — o conteúdo das
 * fichas (FICHAS, em data.js) só existe em português. Por isso os
 * textos fixos aqui (títulos das secções, "Ficha de Decisão —", etc.)
 * estão escritos diretamente em português, sem passar por t()/tBloco().
 */

const estado3 = lerEstado();

// Filtra a seleção feita no Instrumento 2 aos blocos que realmente têm
// ficha em data.js — devia ser sempre igual à seleção completa (a
// checkbox de blocos sem ficha vem sempre desativada), mas o filter()
// aqui é uma segunda proteção, sem custo, contra dados inconsistentes.
const idsSelecionados = estado3.blocosSelecionados.filter(id => FICHAS[id]);

// Qual ficha está visível agora. Começa na primeira da lista.
let fichaAtivaId = idsSelecionados[0];

/** As abas do topo — só aparecem quando há mais de uma ficha para escolher; com só uma, não fazem falta. */
function renderAbas() {
  if (idsSelecionados.length <= 1) return '';
  return `
    <div class="abas-fichas">
      ${idsSelecionados.map(id => {
        const bloco = BMC_BLOCOS.find(b => b.id === id);
        return `<button type="button" class="aba-ficha ${id === fichaAtivaId ? 'ativa' : ''}" data-aba="${id}">${bloco ? bloco.nome : FICHAS[id].titulo}</button>`;
      }).join('')}
    </div>`;
}

/** As seis secções de uma Ficha de Decisão completa: contexto, aplicações, orientação tecnológica (tabela de opções), ações concretas, critérios de avaliação (tabela), e conformidade/governança. */
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

/**
 * Estado "por preencher" de uma ficha — neste momento não é usado por
 * nenhuma das 4 fichas (todas estão completas em data.js), mas fica
 * pronto para o caso de, no futuro, se adicionar/editar uma ficha e
 * quiser mostrar-se um aviso em vez de conteúdo a meio, em vez de deixar
 * a página rebentar por faltarem campos (contexto, aplicacoes, etc.).
 * Ativa-se marcando `pendente: true` no objeto da ficha, em data.js.
 */
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

/** Desenha as abas (se aplicável) e o conteúdo da ficha ativa. Se a ficha ativa deixar de estar na lista (ex: idioma mudou os ids — não acontece aqui, mas é uma proteção barata), volta para a primeira. */
function render() {
  if (idsSelecionados.length === 0) {
    document.getElementById('lista-fichas').innerHTML = `
      <div class="cartao">
        <p class="nota">Nenhum bloco com Ficha de Decisão foi selecionado no Instrumento 2. Pode <a href="instrumento2.html">rever a seleção</a> ou avançar para a síntese.</p>
      </div>`;
    return;
  }

  if (!idsSelecionados.includes(fichaAtivaId)) fichaAtivaId = idsSelecionados[0];

  const bloco = BMC_BLOCOS.find(b => b.id === fichaAtivaId);
  const ficha = FICHAS[fichaAtivaId];
  const conteudoFicha = ficha.pendente ? renderFichaPendente(bloco, ficha) : renderFichaCompleta(bloco, ficha);

  document.getElementById('lista-fichas').innerHTML = renderAbas() + conteudoFicha;

  document.querySelectorAll('.aba-ficha').forEach(botao => {
    botao.addEventListener('click', () => {
      fichaAtivaId = botao.dataset.aba;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' }); // ao trocar de aba, sobe ao topo — sem isto, se se mudasse de aba a meio do scroll, ficava-se a meio de outra ficha
    });
  });
}

/** Mini-grelha do cabeçalho com o resultado do diagnóstico (igual às outras páginas — ver o comentário equivalente em instrumento1.js para a razão do "else"). */
function atualizarMapa() {
  const celulas = document.querySelectorAll('#mapa i');
  BMC_BLOCOS.forEach((bloco, idx) => {
    if (!celulas[idx]) return;
    const resultado = estado3.diagnostico[bloco.id];
    if (resultado) {
      celulas[idx].classList.add('preenchido');
      celulas[idx].setAttribute('data-p', resultado.prioridade);
    } else {
      celulas[idx].classList.remove('preenchido');
      celulas[idx].removeAttribute('data-p');
    }
  });
}

document.getElementById('continuar').addEventListener('click', () => {
  window.location.href = 'resultados.html';
});

render();
atualizarMapa();
