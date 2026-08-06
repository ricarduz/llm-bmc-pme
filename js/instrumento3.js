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
 * Nota: a página em si já tem seletor de idioma (título, botões, etc.
 * traduzem-se normalmente), e o conteúdo das fichas já tem uma tradução
 * de trabalho para inglês (TRADUCOES_I1_EN.fichas, em i18n.js) — mas é
 * uma tradução ainda não revista, por isso mostra-se sempre um aviso a
 * dizer isso mesmo quando o site está em inglês (ver
 * avisoTraducaoIndicativa(), mais abaixo).
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
    <div class="abas-fichas" role="tablist">
      ${idsSelecionados.map(id => {
        const bloco = BMC_BLOCOS.find(b => b.id === id);
        const ativa = id === fichaAtivaId;
        return `<button type="button" class="aba-ficha ${ativa ? 'ativa' : ''}" data-aba="${id}" role="tab" aria-selected="${ativa}">${bloco ? tBloco(bloco).nome : tFicha(id).titulo}</button>`;
      }).join('')}
    </div>`;
}

/** Aviso mostrado no topo de uma ficha quando o site está em inglês — a tradução (ver tFicha(), em i18n.js) ainda não foi revista formalmente, por isso é mais honesto avisar disso do que apresentá-la como definitiva. */
function avisoTraducaoIndicativa() {
  if (obterIdioma() !== 'en') return '';
  return `<p class="nota" style="margin-bottom:20px;">${t('i3-traducao-indicativa')}</p>`;
}

/** As seis secções de uma Ficha de Decisão completa: contexto, aplicações, orientação tecnológica (tabela de opções), ações concretas, critérios de avaliação (tabela), e conformidade/governança. */
function renderFichaCompleta(bloco, ficha) {
  return `
    <div class="cartao">
      <div class="cartao-cabecalho">
        <div>
          <span class="area-tag">${ficha.area} · ${ficha.requisitos}</span>
          <h2 style="margin-bottom:0;">${t('ficha-titulo-sufixo')} — ${ficha.titulo}</h2>
        </div>
        <span class="selo" data-p="${estado3.diagnostico[bloco.id].prioridade}">${estado3.diagnostico[bloco.id].prioridade}</span>
      </div>

      ${avisoTraducaoIndicativa()}

      <h3>1. ${t('ficha-contexto')}</h3>
      <p>${ficha.contexto}</p>

      <h3>2. ${t('ficha-aplicacoes')}</h3>
      <ul>${ficha.aplicacoes.map(a => `<li>${a}</li>`).join('')}</ul>

      <h3>3. ${t('ficha-tecnologia')}</h3>
      <table>
        <thead><tr><th>${t('th-opcao')}</th><th>${t('th-adequada-quando')}</th><th>${t('th-consideracoes')}</th></tr></thead>
        <tbody>
          ${ficha.orientacaoTecnologica.map(o => `
            <tr><td>${o.opcao}</td><td>${o.quando}</td><td>${o.consideracoes}</td></tr>
          `).join('')}
        </tbody>
      </table>

      <h3 style="margin-top:20px;">4. ${t('ficha-acoes')}</h3>
      <ul>${ficha.acoes.map(a => `<li>${a}</li>`).join('')}</ul>

      <h3>5. ${t('ficha-criterios')}</h3>
      <table>
        <thead><tr><th>${t('th-criterio')}</th><th>${t('th-indicador')}</th></tr></thead>
        <tbody>
          ${ficha.criterios.map(c => `<tr><td>${c.criterio}</td><td>${c.indicador}</td></tr>`).join('')}
        </tbody>
      </table>

      <h3 style="margin-top:20px;">6. ${t('ficha-governanca')}</h3>
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
        <p class="nota">${t('i3-nenhuma-ficha')}</p>
      </div>`;
    return;
  }

  if (!idsSelecionados.includes(fichaAtivaId)) fichaAtivaId = idsSelecionados[0];

  const bloco = BMC_BLOCOS.find(b => b.id === fichaAtivaId);
  const ficha = tFicha(fichaAtivaId);
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

document.addEventListener('idioma:alterado', render);

render();
atualizarMapa();
