/**
 * resultados.js — página final, em dois passos:
 *   Passo 1 — duas perguntas de satisfação + contacto por email
 *   Passo 2 — o resultado do diagnóstico, em duas abas (Descarregar / Resultados)
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
 * pronto (o payload inclui "tipo": "diagnostico" ou "contacto", para
 * encaminhar para folhas diferentes na mesma folha de cálculo).
 */
const GOOGLE_SHEETS_URL = '';

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

/**
 * Plano B para incorporar uma imagem no ficheiro exportado, usado quando
 * o fetch() abaixo falha — o que acontece sempre que a página é aberta
 * por duplo-clique (protocolo file://), onde os navegadores bloqueiam
 * fetch() a outros ficheiros locais por política de CORS. Um <img> não
 * tem essa restrição, por isso carrega-se a imagem "à moda antiga" e
 * lê-se o resultado através de um <canvas>.
 * Exporta-se sempre em PNG (não JPEG): se um dia os logótipos passarem a
 * ter fundo transparente, um JPEG preenchia essa transparência a preto —
 * o PNG evita essa armadilha, sem custo real (são ficheiros pequenos).
 */
function imagemParaDataURLViaCanvas(caminho) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext('2d').drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        console.error(`Canvas não conseguiu converter ${caminho}:`, e);
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = caminho;
  });
}

/**
 * Tenta primeiro o caminho "normal" (fetch + FileReader, preserva os
 * bytes originais tal e qual). Se isso rebentar — tipicamente por causa
 * do file:// — cai para o plano B via <canvas>. Se os dois falharem,
 * devolve null e quem chama trata disso mostrando o rodapé sem logótipo,
 * em vez de partir o ficheiro inteiro.
 */
async function imagemParaDataURL(caminho) {
  try {
    const resposta = await fetch(caminho);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const blob = await resposta.blob();
    return await new Promise((resolve, reject) => {
      const leitor = new FileReader();
      leitor.onload = () => resolve(leitor.result);
      leitor.onerror = reject;
      leitor.readAsDataURL(blob);
    });
  } catch (e) {
    return await imagemParaDataURLViaCanvas(caminho);
  }
}

/** Tabela "Perfil de prioridade por bloco" — só os blocos já respondidos no Instrumento 1 (nem todos têm de estar preenchidos para se chegar aqui). */
function renderTabela() {
  const linhas = BMC_BLOCOS
    .filter(b => estadoR.diagnostico[b.id])
    .map(b => {
      const r = estadoR.diagnostico[b.id];
      return `
        <tr>
          <td>${tBloco(b).nome}</td>
          <td>${r.prontidao}</td>
          <td>${r.impacto}</td>
          <td><span class="selo" data-p="${r.prioridade}">${tPrioridade(r.prioridade)}</span></td>
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
  return `
    <div style="margin-bottom:24px; padding-bottom:24px; border-bottom:1px solid var(--line);">
      <h4 style="margin-bottom:4px;">${tBloco(bloco).nome} — ${t('ficha-titulo-sufixo')}</h4>
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

function renderAprofundados() {
  const el = document.getElementById('blocos-aprofundados');
  if (todosBlocosDiferir()) {
    el.innerHTML = `<p class="nota">${t('sintese-todos-diferir')}</p>`;
    return;
  }
  if (estadoR.blocosSelecionados.length === 0) {
    el.innerHTML = `<p class="nota">${t('sintese-nenhum-bloco')}</p>`;
    return;
  }
  el.innerHTML = estadoR.blocosSelecionados.map(id => {
    const bloco = BMC_BLOCOS.find(b => b.id === id);
    const ficha = FICHAS[id];
    if (!bloco || !ficha) return '';
    return renderFichaResumo(bloco, ficha);
  }).join('');
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

/** Troca entre as abas "Descarregar" e "Resultados" dentro do Passo 2. */
function irParaAba(aba) {
  document.getElementById('aba-descarregar').hidden = aba !== 'descarregar';
  document.getElementById('aba-resultado').hidden = aba !== 'resultado';
  document.querySelectorAll('.aba-painel').forEach(botao => {
    botao.classList.toggle('ativa', botao.dataset.aba === aba);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.aba-painel').forEach(botao => {
  botao.addEventListener('click', () => irParaAba(botao.dataset.aba));
});

/** Troca entre o Passo 1 (satisfação/contacto) e o Passo 2 (resultado). Ao entrar no Passo 2, volta sempre à aba "Descarregar" primeiro — é a ação mais importante (e a mais rápida de encontrar), não faz sentido abrir sempre na aba de leitura. */
function irParaPasso(n) {
  [1, 2].forEach(i => {
    document.getElementById(`r-passo-${i}`).hidden = i !== n;
    const dot = document.getElementById(`passo-dot-${i}`);
    dot.classList.toggle('ativo', i === n);
    dot.classList.toggle('concluido', i < n);
  });
  if (n === 2) irParaAba('descarregar');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * O link "← Voltar" do Passo 1 devolve ao instrumento certo, espelhando
 * exatamente o caminho de ida (ver o "Continuar" de instrumento1.js e
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

/** O botão "Seguinte" do Passo 1 só ativa quando as duas perguntas de satisfação têm resposta — o contacto por email fica sempre opcional. */
function validarSatisfacao() {
  const percebeu = document.querySelector('input[name="satisfacao-percebeu"]:checked');
  const util = document.querySelector('input[name="satisfacao-util"]:checked');
  document.getElementById('ir-passo-2').disabled = !(percebeu && util);
  return { percebeu, util };
}

/** Grava a satisfação assim que as duas perguntas tiverem resposta (não espera por um botão "Guardar" — a diferença de fricção não compensa aqui). */
function guardarSatisfacao() {
  const { percebeu, util } = validarSatisfacao();
  if (!percebeu || !util) return;
  const estadoAtual = lerEstado();
  estadoAtual.satisfacao = { percebeu: percebeu.value, util: util.value };
  guardarEstado(estadoAtual);
}

/** Se a página for recarregada a meio (ex: F5), repõe as respostas de satisfação já dadas antes. */
function restaurarSatisfacao() {
  const satisfacao = estadoR.satisfacao;
  if (!satisfacao) return;
  if (satisfacao.percebeu) {
    const el = document.querySelector(`input[name="satisfacao-percebeu"][value="${satisfacao.percebeu}"]`);
    if (el) el.checked = true;
  }
  if (satisfacao.util) {
    const el = document.querySelector(`input[name="satisfacao-util"][value="${satisfacao.util}"]`);
    if (el) el.checked = true;
  }
  validarSatisfacao();
}

document.querySelectorAll('input[name="satisfacao-percebeu"], input[name="satisfacao-util"]').forEach(input => {
  input.addEventListener('change', () => { validarSatisfacao(); guardarSatisfacao(); });
});

document.getElementById('ir-passo-2').addEventListener('click', () => {
  // Envio de segurança: garante que os dados chegam mesmo que o
  // utilizador nunca chegue a carregar em "Descarregar resumo" (por
  // exemplo, se só quiser ver o resultado e fechar a página). Como isto
  // pode fazer com que a mesma sessão gere mais do que uma linha na
  // folha (se depois também descarregar ou terminar a sessão), usa-se o
  // sessionId para as identificar como a mesma pessoa.
  enviarParaGoogleSheets(construirRegisto('seguinte'));
  irParaPasso(2);
});
document.getElementById('voltar-passo-1').addEventListener('click', () => irParaPasso(1));

/**
 * Reúne tudo o que interessa sobre a sessão num único objeto — usado
 * para o envio (opcional) ao Google Sheets. Já não é oferecido para
 * download direto (o utilizador final não precisa de JSON), mas
 * mantém-se como estrutura de dados para fins de investigação.
 *
 * Importante: lê o estado de novo aqui (`lerEstado()`), em vez de usar a
 * constante `estadoR` do topo do ficheiro. `estadoR` é lida uma única
 * vez quando a página carrega — mas a satisfação só é respondida DEPOIS
 * disso, e `guardarSatisfacao()` grava num objeto de estado à parte, sem
 * atualizar `estadoR`. Se este registo usasse `estadoR`, a satisfação
 * enviada ficaria sempre vazia, mesmo depois de respondida (foi
 * exatamente este bug que fazia "percebeu"/"útil" chegarem em branco à
 * folha do Google).
 *
 * Os valores se enviam já traduzidos para texto legível (ex: "Portugal"
 * em vez de "pt", "Pequena empresa" em vez de "pequena") — o código
 * interno (setor, escalões, ids de bloco) serve para a lógica da
 * ferramenta, mas quem vai analisar a folha de cálculo não devia ter de
 * decifrar esses códigos.
 *
 * `origem` identifica qual ação disparou este envio em concreto
 * (Seguinte / Descarregar / Terminar — ver mais abaixo). Como há três
 * pontos de envio diferentes para garantir que os dados chegam mesmo que
 * o utilizador não descarregue o resumo, a mesma sessão pode gerar mais
 * do que uma linha na folha — `sessionId` é o que permite identificar
 * quais linhas pertencem à mesma sessão (por exemplo, para manter só a
 * mais completa/recente de cada uma numa análise).
 */
function construirRegisto(origem) {
  const estadoAtual = lerEstado();
  const perfil = estadoAtual.perfilEmpresa || {};
  const satisfacao = estadoAtual.satisfacao || {};

  const perfilLegivel = perfil.setor ? {
    setor: t('perfil-setor-' + perfil.setor),
    colaboradores: perfil.colaboradores,
    faturacao: rotuloEscalao(perfil.criterioFinanceiro, perfil.escalaoFinanceiro),
    classificacaoSME: t('classificacao-valor-' + classificacaoSME(perfil.colaboradores, perfil.escalaoFinanceiro)),
    pais: perfil.pais === 'pt' ? t('perfil-pais-pt') : t('perfil-pais-europa'),
    regiao: perfil.pais === 'pt' && perfil.regiao ? t('perfil-regiao-' + perfil.regiao) : ''
  } : {};

  // { "Nome do Bloco": "Prioridade" }, só os blocos já respondidos —
  // nomes por extenso, não os ids internos (ex: "canais").
  const diagnosticoLegivel = {};
  BMC_BLOCOS.forEach(bloco => {
    const resultado = estadoAtual.diagnostico[bloco.id];
    if (resultado) diagnosticoLegivel[tBloco(bloco).nome] = tPrioridade(resultado.prioridade);
  });

  const simNao = (valor) => valor === 'sim' ? 'Sim' : (valor === 'nao' ? 'Não' : '');

  return {
    tipo: 'diagnostico',
    origem: origem,
    sessionId: estadoAtual.sessionId,
    concluidoEm: new Date().toISOString(),
    consentimentoInicial: estadoAtual.consentimento ? 'Sim' : 'Não',
    satisfacaoPercebeu: simNao(satisfacao.percebeu),
    satisfacaoUtil: simNao(satisfacao.util),
    perfil: perfilLegivel,
    diagnostico: diagnosticoLegivel,
    blocosAprofundados: estadoAtual.blocosSelecionados
      .map(id => { const b = BMC_BLOCOS.find(x => x.id === id); return b ? tBloco(b).nome : id; })
      .join(', ')
  };
}

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

/** Texto do escalão financeiro para o resumo exportado — "média" e "grande" têm limiares diferentes consoante o critério (volume vs. balanço), por isso a chave de tradução inclui o critério; "micro" e "pequena" são iguais nos dois, por isso não. */
function rotuloEscalao(criterio, escalao) {
  if (escalao === 'media' || escalao === 'grande') return t(`perfil-escalao-${escalao}-${criterio}`);
  return t(`perfil-escalao-${escalao}`);
}

/**
 * Monta o ficheiro .html "para toda a gente" — o que se descarrega no
 * botão principal desta página. Tem de ser assíncrona por causa dos
 * logótipos (imagemParaDataURL devolve uma Promise). Nota como todos os
 * textos vêm de t()/tBloco() no idioma atual: se o utilizador estiver
 * com a página em inglês, o ficheiro exportado também sai em inglês.
 */
async function construirResumoHTML() {
  const perfil = estadoR.perfilEmpresa || {};
  const idioma = obterIdioma();
  const dataGeracao = new Date().toLocaleDateString(idioma === 'pt' ? 'pt-PT' : 'en-GB');

  const [logoUab, logoUtad] = await Promise.all([
    imagemParaDataURL('assets/logo-uab-placeholder.jpeg'),
    imagemParaDataURL('assets/logo-utad-placeholder.jpeg')
  ]);

  const linhasDiagnostico = BMC_BLOCOS
    .filter(b => estadoR.diagnostico[b.id])
    .map(b => {
      const r = estadoR.diagnostico[b.id];
      return `<tr><td>${tBloco(b).nome}</td><td>${r.prontidao}</td><td>${r.impacto}</td><td>${tPrioridade(r.prioridade)}</td></tr>`;
    }).join('');

  const listaAprofundados = todosBlocosDiferir()
    ? `<p>${t('sintese-todos-diferir')}</p>`
    : estadoR.blocosSelecionados.length
    ? estadoR.blocosSelecionados.map(id => {
        const bloco = BMC_BLOCOS.find(b => b.id === id);
        const ficha = FICHAS[id];
        if (!bloco || !ficha) return '';
        const linha = (rotulo, itens) => `<tr><th>${rotulo}</th><td><ul style="margin:0; padding-left:18px;">${itens.map(i => `<li>${i}</li>`).join('')}</ul></td></tr>`;
        return `
          <h3>${tBloco(bloco).nome} — ${t('ficha-titulo-sufixo')}</h3>
          <p><em>${ficha.area} · ${ficha.requisitos}</em></p>
          <p><strong>${t('ficha-contexto')}:</strong> ${ficha.contexto}</p>
          <table>${linha(t('ficha-aplicacoes'), ficha.aplicacoes)}</table>
          <table>
            <thead><tr><th>${t('th-opcao')}</th><th>${t('th-adequada-quando')}</th><th>${t('th-consideracoes')}</th></tr></thead>
            <tbody>${ficha.orientacaoTecnologica.map(o => `<tr><td>${o.opcao}</td><td>${o.quando}</td><td>${o.consideracoes}</td></tr>`).join('')}</tbody>
          </table>
          <table>${linha(t('ficha-acoes'), ficha.acoes)}</table>
          <table>
            <thead><tr><th>${t('th-criterio')}</th><th>${t('th-indicador')}</th></tr></thead>
            <tbody>${ficha.criterios.map(c => `<tr><td>${c.criterio}</td><td>${c.indicador}</td></tr>`).join('')}</tbody>
          </table>
          <p><strong>${t('ficha-governanca')}:</strong> ${ficha.governanca}</p>`;
      }).join('<hr style="margin:24px 0; border:none; border-top:1px solid #DADDD9;">')
    : `<p>${t('sintese-nenhum-bloco')}</p>`;

  // O perfil da empresa só aparece se o Passo 1 do index chegou a ser
  // preenchido (perfil.setor existe) — sessões antigas, de antes desse
  // ecrã existir, não têm este bloco no ficheiro exportado.
  const blocoPerfil = perfil.setor ? `
    <h2>${t('passo1-titulo')}</h2>
    <table>
      <tr><th>${t('perfil-setor-label')}</th><td>${t('perfil-setor-' + perfil.setor)}</td></tr>
      <tr><th>${t('perfil-colaboradores-label')}</th><td>${perfil.colaboradores}</td></tr>
      <tr><th>${t('perfil-faturacao-label')}</th><td>${rotuloEscalao(perfil.criterioFinanceiro, perfil.escalaoFinanceiro)}</td></tr>
      <tr><th>${t('classificacao-label')}</th><td>${t('classificacao-valor-' + classificacaoSME(perfil.colaboradores, perfil.escalaoFinanceiro))}</td></tr>
      <tr><th>${t('perfil-pais-label')}</th><td>${perfil.pais === 'pt' ? `${t('perfil-pais-pt')}${perfil.regiao ? ' — ' + t('perfil-regiao-' + perfil.regiao) : ''}` : t('perfil-pais-europa')}</td></tr>
    </table>
  ` : '';

  // Ficheiro HTML autónomo: CSS embutido (não depende de style.css) e
  // logótipos como data: URLs (não dependem da pasta assets/) — para
  // continuar a abrir bem mesmo copiado para outro computador, sem o
  // resto do site à volta.
  return `<!DOCTYPE html>
<html lang="${idioma === 'pt' ? 'pt-PT' : 'en'}">
<head>
<meta charset="UTF-8">
<title>LLM em PME — ${t('sintese-h1')}</title>
<style>
  body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; max-width: 720px; margin: 40px auto; padding: 0 24px; color: #16191B; line-height: 1.5; }
  h1 { font-size: 1.6rem; margin-bottom: 4px; }
  h2 { font-size: 1.1rem; margin-top: 32px; border-bottom: 2px solid #6D8297; padding-bottom: 6px; }
  .data { color: #52585C; font-size: 0.9rem; margin-bottom: 24px; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #DADDD9; font-size: 0.92rem; }
  th { color: #52585C; font-weight: 600; }
  footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid #DADDD9; }
  footer .logos { display: flex; align-items: center; gap: 24px; margin-bottom: 12px; }
  footer .logos img { height: 40px; width: auto; display: block; }
  footer p { font-size: 0.8rem; color: #52585C; margin: 0; }
  @media print { body { margin: 0; } }
</style>
</head>
<body>
  <h1>LLM em PME — ${t('sintese-h1')}</h1>
  <p class="data">${dataGeracao}</p>

  ${blocoPerfil}

  <h2>${t('sintese-tabela-titulo')}</h2>
  <table>
    <thead><tr><th>${t('th-bloco')}</th><th>${t('th-prontidao')}</th><th>${t('th-impacto')}</th><th>${t('th-prioridade')}</th></tr></thead>
    <tbody>${linhasDiagnostico || `<tr><td colspan="4">${t('sintese-nenhum-avaliado')}</td></tr>`}</tbody>
  </table>

  <h2>${t('sintese-aprofundados-titulo')}</h2>
  ${listaAprofundados}

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
  } finally {
    botao.disabled = false;
  }
});

document.getElementById('guardar-contacto').addEventListener('click', () => {
  const email = document.getElementById('contacto-email').value.trim();
  const aceite = document.getElementById('contacto-consentimento').checked;
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const mensagem = document.getElementById('contacto-mensagem');

  if (!emailValido || !aceite) {
    mensagem.textContent = t('contacto-email-invalido');
    mensagem.hidden = false;
    return;
  }

  const estadoAtual = lerEstado();
  estadoAtual.contacto = { email, consentimento: true, guardadoEm: new Date().toISOString() };
  guardarEstado(estadoAtual);

  enviarParaGoogleSheets({
    tipo: 'contacto',
    sessionId: lerEstado().sessionId,
    email,
    consentimento: true,
    data: new Date().toISOString()
  });

  mensagem.textContent = t('contacto-confirmacao');
  mensagem.hidden = false;
});

// Há dois botões "Recomeçar" (um em cada passo), mas fazem exatamente a
// mesma coisa — por isso um único querySelectorAll com os dois ids, em
// vez de duplicar o listener.
document.querySelectorAll('#recomecar-1, #recomecar-2').forEach(botao => {
  botao.addEventListener('click', () => {
    if (confirm(t('sessao-recomecar-confirmar'))) {
      limparEstado();
      window.location.href = 'index.html';
    }
  });
});

/**
 * "Terminar sessão": apaga os dados e tenta fechar a janela. window.close()
 * só funciona em separadores abertos por script — numa aba normal, a
 * maioria dos navegadores ignora o pedido, por isso mostra-se sempre o
 * ecrã de despedida por trás, para o utilizador não ficar preso a meio
 * se o fecho automático não resultar (o cenário mais provável).
 */
document.getElementById('terminar').addEventListener('click', () => {
  if (confirm(t('sessao-terminar-confirmar'))) {
    enviarParaGoogleSheets(construirRegisto('terminar')); // tem de ser antes do limparEstado() — depois disso já não há dados para enviar
    limparEstado();
    document.getElementById('conteudo-sessao').hidden = true;
    document.getElementById('ecra-fim').hidden = false;
    window.close();
  }
});

// O conteúdo gerado por JavaScript (tabela, fichas) não se atualiza
// sozinho quando o idioma muda — só o texto marcado com data-i18n é que
// tem esse comportamento automático (ver aplicarTraducoes, em i18n.js).
document.addEventListener('idioma:alterado', () => {
  renderTabela();
  renderAprofundados();
});

renderTabela();
renderAprofundados();
atualizarMapa();
restaurarSatisfacao();
configurarLinkVoltarInstrumento();
irParaPasso(1);
