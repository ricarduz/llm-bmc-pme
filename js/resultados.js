/**
 * resultados.js — página de avaliação do painel de especialistas, em
 * dois passos:
 *   Passo 1 — avaliação nos 4 critérios (utilidade, aplicabilidade,
 *             consistência com a literatura, completude) + reflexão livre
 *   Passo 2 — o resultado do diagnóstico do cenário de demonstração, em
 *             duas abas (Descarregar / Resultados)
 *
 * Esta página deixou de servir PME (essas têm agora o relatório embutido
 * em pme.html, sem nomes de instrumentos à vista) — é exclusiva do
 * percurso do painel de especialistas, tal como descrito no Capítulo 4/6
 * da dissertação.
 *
 * Tal como nas outras páginas, os passos são só <section> escondidas/
 * mostradas com "hidden" — não há navegação real entre páginas.
 */

const estadoR = lerEstado();

/**
 * Integração opcional com Google Sheets (Apps Script Web App).
 * Deixa GOOGLE_SHEETS_URL vazio para desativar o envio automático — a
 * exportação e o contacto por email continuam a funcionar localmente.
 * Preencher com o URL de implementação do Apps Script quando estiver
 * pronto (o payload inclui "tipo": "avaliacao", para
 * encaminhar para folhas diferentes na mesma folha de cálculo).
 */
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyxCM6rhINk_XpIJvqoUC4UUmz1CMEHsA19lLqf7ktTB0R4bidqpD3QFqgO9qE60r8T/exec';

/** Envio "melhor esforço": se falhar (sem rede, URL por preencher, etc.), só regista no console — nunca impede o utilizador de continuar a usar a página. `mode: 'no-cors'` evita o preflight de CORS, ao custo de não se conseguir ler a resposta (aceitável, porque não se precisa dela). */
function enviarParaGoogleSheets(payload) {
  if (!GOOGLE_SHEETS_URL) return;
  fetch(GOOGLE_SHEETS_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload)
  }).catch(e => console.error('Envio para a folha de cálculo falhou:', e));
}

/** Tabela "Perfil de prioridade por bloco" — só os blocos já respondidos no Instrumento 1 (nem todos têm de estar preenchidos para se chegar aqui). */
function renderTabela() {
  const linhas = BMC_BLOCOS
    .filter(b => estadoR.diagnostico[b.id])
    .map(b => {
      const r = estadoR.diagnostico[b.id];
      return `
        <tr>
          <td data-label="${t('th-bloco')}">${tBloco(b).nome}</td>
          <td data-label="${t('th-prontidao')}">${r.prontidao}</td>
          <td data-label="${t('th-impacto')}">${r.impacto}</td>
          <td data-label="${t('th-prioridade')}"><span class="selo" data-p="${r.prioridade}">${tPrioridade(r.prioridade)}</span></td>
        </tr>`;
    }).join('');

  document.getElementById('tabela-diagnostico').innerHTML = `
    <thead><tr><th>${t('th-bloco')}</th><th>${t('th-prontidao')}</th><th>${t('th-impacto')}</th><th>${t('th-prioridade')}</th></tr></thead>
    <tbody>${linhas || `<tr><td colspan="4" class="nota">${t('sintese-nenhum-avaliado')}</td></tr>`}</tbody>
  `;
}

/** Pequeno utilitário para transformar um array de strings numa lista <ul> — repete-se várias vezes por ficha. */
function listaMatriz(itens) {
  return `<ul style="margin:0; padding-left:18px;">${itens.map(i => `<li>${i}</li>`).join('')}</ul>`;
}

/** A Ficha de Decisão de um bloco aprofundado, resumida para leitura na página (mesmas seis secções do Instrumento 3, formatadas em prosa/tabelas em vez de cartões separados). */
function renderFichaResumo(bloco, ficha) {
  const aviso = obterIdioma() === 'en' ? `<p class="nota" style="margin-bottom:14px;">${t('i3-traducao-indicativa')}</p>` : '';
  return `
    <div style="margin-bottom:24px; padding-bottom:24px; border-bottom:1px solid var(--line);">
      <h4 style="margin-bottom:4px;">${tBloco(bloco).nome} — ${t('ficha-titulo-sufixo')}</h4>
      ${aviso}
      <p class="nota" style="margin-bottom:14px;">${ficha.area} · ${ficha.requisitos}</p>

      <p><strong>${t('ficha-contexto')}:</strong> ${ficha.contexto}</p>

      <p style="margin-bottom:6px;"><strong>${t('ficha-aplicacoes')}:</strong></p>
      ${listaMatriz(ficha.aplicacoes)}

      <p style="margin:14px 0 6px;"><strong>${t('ficha-tecnologia')}:</strong></p>
      <table>
        <thead><tr><th>${t('th-opcao')}</th><th>${t('th-adequada-quando')}</th><th>${t('th-consideracoes')}</th></tr></thead>
        <tbody>
          ${ficha.orientacaoTecnologica.map(o => `<tr><td>${o.opcao}</td><td>${o.quando}</td><td>${o.consideracoes}</td></tr>`).join('')}
        </tbody>
      </table>

      <p style="margin:14px 0 6px;"><strong>${t('ficha-acoes')}:</strong></p>
      ${listaMatriz(ficha.acoes)}

      <p style="margin:14px 0 6px;"><strong>${t('ficha-criterios')}:</strong></p>
      <table>
        <thead><tr><th>${t('th-criterio')}</th><th>${t('th-indicador')}</th></tr></thead>
        <tbody>
          ${ficha.criterios.map(c => `<tr><td>${c.criterio}</td><td>${c.indicador}</td></tr>`).join('')}
        </tbody>
      </table>

      <p style="margin-top:14px;"><strong>${t('ficha-governanca')}:</strong> ${ficha.governanca}</p>
    </div>`;
}

/**
 * "Blocos selecionados para aprofundamento": mostra a Ficha de Decisão
 * completa de cada bloco escolhido no Instrumento 2 — não só o nome, que
 * era o que se mostrava numa versão anterior desta página. Como todo o
 * bloco em blocosSelecionados tem garantidamente ficha (ver Instrumento 2),
 * o `if (!bloco || !ficha) return ''` é só uma proteção defensiva, não
 * um caminho que se espere que aconteça na prática.
 */
/**
 * True só quando o diagnóstico está completo (os 9 blocos respondidos) E
 * todos saíram como "Diferir" — o único caso em que faz sentido dizer
 * explicitamente "esta empresa não cumpre os critérios", em vez da
 * mensagem genérica de "nenhum bloco selecionado" (que também aparece,
 * por exemplo, se houver blocos Prioritário/Relevante mas o utilizador
 * simplesmente não escolheu aprofundar nenhum).
 */
function todosBlocosDiferir() {
  const valores = Object.values(estadoR.diagnostico);
  return valores.length === BMC_BLOCOS.length && valores.every(v => v.prioridade === 'Diferir');
}

/** Mini-grelha do cabeçalho com o resultado do diagnóstico (mesma lógica das outras páginas — reset explícito das células sem resultado, para não ficarem presas com a cor de uma sessão anterior). */
function atualizarMapa() {
  const celulas = document.querySelectorAll('#mapa i');
  BMC_BLOCOS.forEach((bloco, idx) => {
    if (!celulas[idx]) return;
    const resultado = estadoR.diagnostico[bloco.id];
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
 * O link "← Voltar" devolve ao instrumento certo, espelhando exatamente
 * o caminho de ida (ver o "Continuar" de instrumento1.js e
 * instrumento2.js): se todos os blocos deram "Diferir", nem Instrumento 2
 * nem 3 chegaram a ser visitados, por isso volta-se ao Instrumento 1;
 * caso contrário, ao Instrumento 3 se houver alguma ficha selecionada, ou
 * ao Instrumento 2 caso contrário.
 */
function configurarLinkVoltarInstrumento() {
  const link = document.getElementById('voltar-instrumento');
  if (todosBlocosDiferir()) {
    link.setAttribute('href', 'instrumento1.html');
    return;
  }
  const temFicha = estadoR.blocosSelecionados.some(id => BMC_BLOCOS.find(b => b.id === id)?.ficha);
  link.setAttribute('href', temFicha ? 'instrumento3.html' : 'instrumento2.html');
}

/** O botão "Concluir" só ativa quando os 4 critérios têm resposta — os comentários e a reflexão livre ficam sempre opcionais. */
/**
 * Critérios esperados por perfil de especialista, tal como definido na
 * Tabela 4 da dissertação ("Painel de especialistas: perfis, critérios
 * de seleção e contribuição esperada") — cada perfil só é confrontado
 * com os 2 critérios para os quais tem melhor posição para se
 * pronunciar; os outros 2 cartões ficam escondidos, não desativados,
 * para não sugerir uma pergunta que não se pretende fazer a este perfil.
 */
const CRITERIOS_POR_PERFIL = {
  'gestor-pme': ['aplicabilidade', 'utilidade'],
  'profissional-ti': ['completude', 'utilidade'],
  'academico': ['consistencia', 'completude']
};

/** Devolve os critérios a mostrar a este especialista — se o perfil não tiver sido definido (sessões antigas, antes deste campo existir), mostra os 4, por segurança. */
function criteriosAtivos() {
  const perfil = estadoR.perfilEspecialista;
  return CRITERIOS_POR_PERFIL[perfil] || ['utilidade', 'aplicabilidade', 'consistencia', 'completude'];
}

/** Esconde os cartões de critério que não se aplicam a este perfil de especialista — chamada uma vez, ao carregar a página. */
function aplicarCriteriosPorPerfil() {
  const ativos = criteriosAtivos();
  document.querySelectorAll('[data-criterio]').forEach(cartao => {
    cartao.hidden = !ativos.includes(cartao.dataset.criterio);
  });
}

function validarAvaliacao() {
  return criteriosAtivos().every(c => document.querySelector(`input[name="av-${c}"]:checked`));
}

/** Mínimo de palavras exigido na reflexão livre para desbloquear a secção "Resultados". */
const MINIMO_PALAVRAS_REFLEXAO = 75;

/** Conta palavras de um texto — usado para exigir um mínimo na reflexão livre. Divide por espaços em branco e ignora entradas vazias (ex: espaços a mais no início/fim não contam como palavra). */
function contarPalavras(texto) {
  return texto.trim().split(/\s+/).filter(Boolean).length;
}

/** True só quando os critérios do perfil (2, conforme a Tabela 4 — ver criteriosAtivos()) têm resposta E a reflexão livre tem pelo menos MINIMO_PALAVRAS_REFLEXAO palavras — as duas condições para a secção "Resultados" desbloquear. */
function avaliacaoCompleta() {
  const palavras = contarPalavras(document.getElementById('av-reflexao').value);
  return validarAvaliacao() && palavras >= MINIMO_PALAVRAS_REFLEXAO;
}

/** Atualiza o contador de palavras da reflexão, e mostra/esconde a secção "Resultados" (email + download) consoante a avaliação esteja completa — ver avaliacaoCompleta(). O botão "Concluir" segue a mesma regra. As mensagens ajustam-se ao número de critérios deste perfil (2, não sempre 4 — ver criteriosAtivos()). */
function atualizarDisponibilidadeResultados() {
  const palavras = contarPalavras(document.getElementById('av-reflexao').value);
  const contador = document.getElementById('contador-palavras');
  contador.textContent = `${palavras} de ${MINIMO_PALAVRAS_REFLEXAO} palavras`;
  contador.style.color = palavras >= MINIMO_PALAVRAS_REFLEXAO ? 'var(--uab-azul)' : '';

  const numCriterios = criteriosAtivos().length;
  document.getElementById('texto-bloqueado').textContent =
    t('sintese-bloqueio-texto').replace('{n}', numCriterios).replace('{min}', MINIMO_PALAVRAS_REFLEXAO);

  const completa = avaliacaoCompleta();
  document.getElementById('resultados-bloqueado').hidden = completa;
  document.getElementById('resultados-desbloqueado').hidden = !completa;
  document.getElementById('terminar').disabled = !completa;
}

/** Grava a avaliação assim que os critérios têm resposta — não espera por um botão "Guardar" à parte. */
function guardarAvaliacao() {
  const criterios = ['utilidade', 'aplicabilidade', 'consistencia', 'completude'];
  const estadoAtual = lerEstado();
  estadoAtual.avaliacao = {};
  criterios.forEach(c => {
    const marcado = document.querySelector(`input[name="av-${c}"]:checked`);
    estadoAtual.avaliacao[c] = marcado ? marcado.value : '';
    estadoAtual.avaliacao[`${c}Comentario`] = document.getElementById(`av-${c}-comentario`).value.trim();
  });
  estadoAtual.avaliacao.reflexao = document.getElementById('av-reflexao').value.trim();
  guardarEstado(estadoAtual);
  atualizarDisponibilidadeResultados();
}

/** Se a página for recarregada a meio (ex: F5), repõe a avaliação já registada antes. */
function restaurarAvaliacao() {
  const avaliacao = estadoR.avaliacao;
  if (estadoR.contacto && estadoR.contacto.email) {
    document.getElementById('email-especialista').value = estadoR.contacto.email;
  }
  if (!avaliacao) { atualizarDisponibilidadeResultados(); return; }
  ['utilidade', 'aplicabilidade', 'consistencia', 'completude'].forEach(c => {
    if (avaliacao[c]) {
      const el = document.querySelector(`input[name="av-${c}"][value="${avaliacao[c]}"]`);
      if (el) el.checked = true;
    }
    const comentario = document.getElementById(`av-${c}-comentario`);
    if (comentario && avaliacao[`${c}Comentario`]) comentario.value = avaliacao[`${c}Comentario`];
  });
  if (avaliacao.reflexao) document.getElementById('av-reflexao').value = avaliacao.reflexao;
  atualizarDisponibilidadeResultados();
}

document.getElementById('av-reflexao').addEventListener('input', () => { atualizarDisponibilidadeResultados(); });

document.querySelectorAll('input[name^="av-"]').forEach(input => {
  input.addEventListener('change', () => { validarAvaliacao(); guardarAvaliacao(); });
});
document.querySelectorAll('[id^="av-"][id$="-comentario"], #av-reflexao').forEach(campo => {
  campo.addEventListener('blur', guardarAvaliacao);
});

/**
 * Reúne tudo o que interessa sobre a sessão de avaliação de um
 * especialista num único objeto, para o envio (opcional) ao Google
 * Sheets. Substituiu o antigo registo de "satisfação" de PME — esta
 * página passou a ser exclusiva do painel de avaliação (o percurso para
 * PME tem agora o relatório embutido em pme.html).
 *
 * Importante: lê o estado de novo aqui (`lerEstado()`), em vez de usar a
 * constante `estadoR` do topo do ficheiro — a mesma razão de sempre:
 * `estadoR` é lida uma única vez ao carregar a página, mas a avaliação
 * só é preenchida depois, num objeto de estado à parte.
 *
 * `origem` e `sessionId` mantêm-se pela mesma razão de antes: há dois
 * pontos de envio possíveis (Descarregar/Concluir), por isso a mesma
 * sessão pode gerar mais do que uma linha — usa-se o sessionId para
 * identificar quais pertencem à mesma sessão de avaliação.
 */
function construirRegisto(origem) {
  const estadoAtual = lerEstado();
  const avaliacao = estadoAtual.avaliacao || {};

  return {
    tipo: 'avaliacao',
    origem: origem,
    sessionId: estadoAtual.sessionId,
    concluidoEm: new Date().toISOString(),
    perfilEspecialista: estadoAtual.perfilEspecialista || '',
    utilidade: avaliacao.utilidade || '',
    utilidadeComentario: avaliacao.utilidadeComentario || '',
    aplicabilidade: avaliacao.aplicabilidade || '',
    aplicabilidadeComentario: avaliacao.aplicabilidadeComentario || '',
    consistencia: avaliacao.consistencia || '',
    consistenciaComentario: avaliacao.consistenciaComentario || '',
    completude: avaliacao.completude || '',
    completudeComentario: avaliacao.completudeComentario || '',
    reflexao: avaliacao.reflexao || ''
  };
}

/**
 * Mapa de cada bloco para a sua posição clássica no desenho do Business
 * Model Canvas — os mesmos nomes de grid-area usados em .bmc-diagrama,
 * em style.css. Usado aqui porque o ficheiro exportado não pode
 * depender do style.css do site (tem de continuar a abrir corretamente
 * copiado para outro computador), por isso o CSS do diagrama vai
 * embutido no próprio ficheiro, com estilos inline por bloco.
 */
const AREA_GRID = {
  'parcerias-chave': 'parcerias',
  'atividades-chave': 'atividades',
  'recursos-chave': 'recursos',
  'proposta-valor': 'valor',
  'relacionamento-clientes': 'relacionamento',
  'canais': 'canais',
  'segmentos-clientes': 'segmentos',
  'estrutura-custos': 'custos',
  'fontes-receita': 'receita'
};

/** Utilitário genérico para descarregar uma string como ficheiro — cria um link temporário, "clica" nele por código, e limpa logo a seguir (URL.revokeObjectURL evita acumular URLs órfãos na memória do separador). */
function descarregarFicheiro(conteudo, nomeFicheiro, tipoMime) {
  const blob = new Blob([conteudo], { type: tipoMime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nomeFicheiro;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Monta o ficheiro .html "para toda a gente" — o que se descarrega no
 * botão principal desta página. Tem de ser assíncrona por causa dos
 * logótipos (imagemParaDataURL devolve uma Promise, ver
 * js/relatorio-utils.js). Nota como todos os textos vêm de t()/tBloco()
 * no idioma atual: se o utilizador estiver com a página em inglês, o
 * ficheiro exportado também sai em inglês.
 */
async function construirResumoHTML() {
  const idioma = obterIdioma();
  const dataGeracao = new Date().toLocaleDateString(idioma === 'pt' ? 'pt-PT' : 'en-GB');

  // Le o estado fresco - tal como em construirRegisto(), `estadoR` foi
  // lida uma unica vez ao carregar a pagina, antes de a avaliacao ser
  // preenchida.
  const estadoAtual = lerEstado();
  const avaliacao = estadoAtual.avaliacao || {};
  const ativos = criteriosAtivos();

  const PERFIS_LEGIVEIS = {
    'gestor-pme': idioma === 'pt' ? 'Gestor / Proprietário de PME' : 'SME Manager / Owner',
    'profissional-ti': idioma === 'pt' ? 'Profissional de TI / Transformação Digital' : 'IT / Digital Transformation Professional',
    'academico': idioma === 'pt' ? 'Investigador / Académico' : 'Researcher / Academic'
  };
  const perfilLegivel = PERFIS_LEGIVEIS[estadoAtual.perfilEspecialista] || (idioma === 'pt' ? 'Não especificado' : 'Not specified');
  const notaNaoAplicavel = idioma === 'pt'
    ? 'Não aplicável — critério fora do âmbito deste perfil de especialista.'
    : 'Not applicable — criterion outside the scope of this specialist profile.';

  const criteriosAvaliacao = [
    { chave: 'utilidade', label: 'Utilidade percebida' },
    { chave: 'aplicabilidade', label: 'Aplicabilidade' },
    { chave: 'consistencia', label: 'Consistência com a literatura' },
    { chave: 'completude', label: 'Completude' }
  ];
  const avaliacaoHTML = criteriosAvaliacao.map(c => {
    if (!ativos.includes(c.chave)) {
      return `<tr><th>${c.label}</th><td><em>${notaNaoAplicavel}</em></td></tr>`;
    }
    const comentario = avaliacao[c.chave + 'Comentario'];
    return `<tr><th>${c.label}</th><td>${avaliacao[c.chave] || '—'} / 5${comentario ? ` — ${escaparHTML(comentario)}` : ''}</td></tr>`;
  }).join('') + (avaliacao.reflexao ? `<tr><th>Reflexão livre</th><td>${escaparHTML(avaliacao.reflexao)}</td></tr>` : '');

  const [logoUab, logoUtad] = await Promise.all([
    imagemParaDataURL('assets/logo-uab-placeholder.jpeg'),
    imagemParaDataURL('assets/logo-utad-placeholder.jpeg')
  ]);

  // Ficheiro HTML autonomo: CSS embutido (nao depende de style.css) e
  // logotipos como data: URLs - para continuar a abrir bem mesmo copiado
  // para outro computador, sem o resto do site a volta. So a avaliacao
  // do especialista - o resultado do diagnostico do cenario de
  // demonstracao nao e relevante aqui (ja foi visto ao vivo nos tres
  // instrumentos).
  return `<!DOCTYPE html>
<html lang="${idioma === 'pt' ? 'pt-PT' : 'en'}">
<head>
<meta charset="UTF-8">
<meta name="color-scheme" content="light">
<title>LLM em PME — ${t('sintese-h1')}</title>
<style>
  html { color-scheme: light; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; max-width: 720px; margin: 40px auto; padding: 0 24px; background: #FFFFFF; color: #16191B; line-height: 1.5; }
  h1 { font-size: 1.6rem; margin-bottom: 4px; }
  .data { color: #52585C; font-size: 0.9rem; margin-bottom: 24px; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #DADDD9; font-size: 0.92rem; }
  th { color: #52585C; font-weight: 600; }
  footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid #DADDD9; }
  footer .logos { display: flex; align-items: center; gap: 24px; margin-bottom: 12px; flex-wrap: wrap; }
  footer .logos img { height: 40px; width: auto; display: block; }
  @media (max-width: 400px) {
    footer .logos { gap: 16px; }
    footer .logos img { height: 30px; }
  }
  footer p { font-size: 0.8rem; color: #52585C; margin: 0; }
  @media print {
    @page { size: A4; margin: 1.8cm; }
    body { margin: 0; max-width: none; }
    *, *::before, *::after { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    table, footer { page-break-inside: avoid; break-inside: avoid; }
    a { color: inherit; text-decoration: none; }
  }
</style>
</head>
<body>
  <h1>LLM em PME — ${t('sintese-h1')}</h1>
  <p class="data">${dataGeracao}</p>
  <p><strong>${idioma === 'pt' ? 'Perfil do especialista' : 'Specialist profile'}:</strong> ${perfilLegivel}</p>
  <p><strong>${idioma === 'pt' ? 'Email fornecido' : 'Email provided'}:</strong> ${estadoAtual.contacto && estadoAtual.contacto.email
    ? `${escaparHTML(estadoAtual.contacto.email)} (${idioma === 'pt' ? 'consentimento confirmado para contacto com os resultados finais' : 'consent confirmed for contact with the final results'})`
    : (idioma === 'pt' ? 'Não' : 'No')}</p>

  <table>
    <tbody>${avaliacaoHTML}</tbody>
  </table>

  <p class="nota" style="margin-top:24px;">${idioma === 'pt'
    ? 'Em caso de dúvidas sobre este estudo, pode contactar o autor através de 2302605@estudante.uab.pt.'
    : 'If you have any questions about this study, you can contact the author at 2302605@estudante.uab.pt.'}</p>

  <footer>
    <div class="logos">
      ${logoUab ? `<img src="${logoUab}" alt="Universidade Aberta">` : ''}
      ${logoUtad ? `<img src="${logoUtad}" alt="UTAD — Universidade de Trás-os-Montes e Alto Douro">` : ''}
    </div>
    <p>${t('rodape-texto')}</p>
  </footer>
</body>
</html>`;
}

document.getElementById('descarregar-resumo').addEventListener('click', async () => {
  const botao = document.getElementById('descarregar-resumo');
  botao.disabled = true; // evita duplo-clique disparar o download/envio duas vezes enquanto os logótipos ainda estão a carregar
  try {
    const html = await construirResumoHTML();
    descarregarFicheiro(html, `llm-em-pme-resumo-${Date.now()}.html`, 'text/html');
    enviarParaGoogleSheets(construirRegisto('descarregar'));
    bloquearFormularioAvaliacao();
  } finally {
    botao.disabled = false;
  }
});

/** Depois de descarregar, a avaliação fica fixa — desativa todos os campos (critérios, comentários, reflexão) para impedir edições depois do registo oficial ter sido gerado. O botão de descarregar continua ativo, para o caso de se querer um segundo ficheiro. */
function bloquearFormularioAvaliacao() {
  document.querySelectorAll('input[name^="av-"], [id^="av-"][id$="-comentario"], #av-reflexao, #email-especialista').forEach(campo => {
    campo.disabled = true;
  });
  const aviso = document.createElement('p');
  aviso.className = 'nota';
  aviso.id = 'aviso-avaliacao-fixa';
  aviso.style.cssText = 'font-weight:600; color:var(--uab-azul); margin-top:12px;';
  aviso.textContent = 'A sua avaliação foi descarregada e ficou registada — os campos acima já não podem ser editados.';
  const primeiroCartao = document.querySelector('#conteudo-sessao .cartao');
  if (primeiroCartao && !document.getElementById('aviso-avaliacao-fixa')) {
    primeiroCartao.parentNode.insertBefore(aviso, primeiroCartao);
  }
}

/**
 * "Concluir": valida que a avaliação está completa, guarda o email (se
 * preenchido e válido), envia os dados e apaga a sessão. window.close()
 * só funciona em separadores abertos por script — numa aba normal, a
 * maioria dos navegadores ignora o pedido, por isso mostra-se sempre o
 * ecrã de despedida por trás, para o utilizador não ficar preso a meio
 * se o fecho automático não resultar (o cenário mais provável).
 */
/** Grava o email assim que for válido — antes só era lido no momento de "Concluir", o que fazia parecer que o campo "não reconhecia" o que lá estava escrito se se tentasse descarregar primeiro. */
function guardarEmailEspecialista() {
  const campoEmail = document.getElementById('email-especialista');
  const email = campoEmail.value.trim();
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!email || !emailValido) return;
  const estadoAtual = lerEstado();
  estadoAtual.contacto = { email, consentimento: true, guardadoEm: new Date().toISOString() };
  guardarEstado(estadoAtual);
}

document.getElementById('email-especialista').addEventListener('blur', guardarEmailEspecialista);
document.getElementById('email-especialista').addEventListener('input', guardarEmailEspecialista);

document.getElementById('terminar').addEventListener('click', () => {
  if (!avaliacaoCompleta()) return; // o botão já vem desativado neste caso — proteção extra, sem custo

  const campoEmail = document.getElementById('email-especialista');
  const email = campoEmail.value.trim();
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (email && !emailValido) {
    campoEmail.focus();
    campoEmail.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  abrirModalConfirmar();
});

/**
 * Modal próprio de confirmação, com botões "Sim"/"Cancelar" — o confirm()
 * nativo do navegador não permite personalizar o texto dos botões (fica
 * sempre "OK"/"Cancelar", ou o equivalente no idioma do sistema
 * operativo, não da página), por isso substituiu-se por este modal.
 * Não usa o motor genérico de modal.js (não queremos fechar ao clicar
 * no fundo escurecido, numa confirmação destrutiva), mas mantém o mesmo
 * cuidado de acessibilidade: foco no botão mais seguro ao abrir, Escape
 * a fechar, foco de volta ao botão que abriu o modal ao fechar.
 */
function abrirModalConfirmar() {
  document.getElementById('modal-confirmar-concluir').hidden = false;
  document.getElementById('btn-cancelar-concluir').focus(); // o botão mais seguro (não destrutivo) recebe o foco por defeito
}

function fecharModalConfirmar() {
  document.getElementById('modal-confirmar-concluir').hidden = true;
  document.getElementById('terminar').focus();
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !document.getElementById('modal-confirmar-concluir').hidden) fecharModalConfirmar();
});

document.getElementById('btn-cancelar-concluir').addEventListener('click', fecharModalConfirmar);

document.getElementById('btn-confirmar-concluir').addEventListener('click', () => {
  document.getElementById('modal-confirmar-concluir').hidden = true;

  const campoEmail = document.getElementById('email-especialista');
  const email = campoEmail.value.trim();

  if (email) {
    const estadoAtual = lerEstado();
    estadoAtual.contacto = { email, consentimento: true, guardadoEm: new Date().toISOString() };
    guardarEstado(estadoAtual);
    enviarParaGoogleSheets({ tipo: 'contacto', origem: 'especialista', sessionId: estadoAtual.sessionId, email, consentimento: true, data: new Date().toISOString() });
  }

  enviarParaGoogleSheets(construirRegisto('terminar')); // tem de ser antes do limparEstado() — depois disso já não há dados para enviar
  limparEstado();
  document.getElementById('conteudo-sessao').hidden = true;
  document.getElementById('ecra-fim').hidden = false;
  window.close();
});

aplicarCriteriosPorPerfil();
atualizarMapa();
restaurarAvaliacao();
configurarLinkVoltarInstrumento();
