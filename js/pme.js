/**
 * pme.js — o "jogo": um fluxo único e contínuo para gestores de PME, sem
 * nomes de instrumentos à vista. Por trás, é exatamente a mesma lógica
 * do percurso académico (instrumento1/2/3.js): os mesmos 9 blocos do
 * BMC, a mesma classificação Prontidão × Impacto (classificarBloco, em
 * data.js), o mesmo conteúdo de Matriz e Fichas de Decisão — só a
 * apresentação muda.
 *
 * Estrutura do percurso (tudo dentro desta única página, sem
 * recarregar): hook -> perfil da empresa (4 perguntas) -> 18 perguntas
 * do diagnóstico (2 por bloco: Prontidão e Impacto) -> ecrã de
 * processamento -> relatório final.
 */

/**
 * As 18 perguntas do diagnóstico, em linguagem de gestor — nunca
 * mencionam "Prontidão", "Impacto" nem "BMC". Cada pergunta tem 3
 * opções, na mesma ordem crescente da escala 1-3 usada em
 * classificarBloco (opção 0 = nível 1, opção 2 = nível 3) — por isso
 * clicar na opção certa continua a alimentar exatamente a mesma tabela
 * de prioridade do percurso académico. A versão inglesa (mesma
 * estrutura, traduzida) vive em TRADUCOES_I1_EN.perguntasJogo, em
 * i18n.js — ver perguntasAtivas(), mais abaixo.
 */
const PERGUNTAS = [
  { bloco: 'segmentos-clientes', eixo: 'prontidao', pergunta: 'Sabe identificar e organizar informação sobre os seus clientes?', opcoes: ['Não, está tudo misturado', 'Mais ou menos, de forma informal', 'Sim, temos isso bem organizado'] },
  { bloco: 'segmentos-clientes', eixo: 'impacto', pergunta: 'Conhecer melhor os seus clientes ajudaria a vender mais ou a servi-los melhor?', opcoes: ['Não é prioridade agora', 'Ajudaria alguma coisa', 'Seria um ganho importante'] },

  { bloco: 'proposta-valor', eixo: 'prontidao', pergunta: 'Costuma personalizar o que oferece a cada cliente, ou produzir conteúdo comercial com regularidade?', opcoes: ['Raramente', 'Às vezes', 'Sim, com frequência'] },
  { bloco: 'proposta-valor', eixo: 'impacto', pergunta: 'Faria diferença se conseguisse adaptar mais depressa a sua oferta a cada cliente?', opcoes: ['Pouca diferença', 'Alguma diferença', 'Muita diferença'] },

  { bloco: 'canais', eixo: 'prontidao', pergunta: 'Já usa canais digitais (website, redes sociais, email) para comunicar com os seus clientes?', opcoes: ['Quase nada', 'Alguns, mas pouco estruturados', 'Sim, de forma organizada'] },
  { bloco: 'canais', eixo: 'impacto', pergunta: 'Melhorar a comunicação digital com clientes é importante para si?', opcoes: ['Não muito', 'Seria útil', 'É uma prioridade'] },

  { bloco: 'relacionamento-clientes', eixo: 'prontidao', pergunta: 'Tem um processo definido de apoio ao cliente e acompanhamento pós-venda?', opcoes: ['Não, é caso a caso', 'Existe, mas informal', 'Sim, bem definido'] },
  { bloco: 'relacionamento-clientes', eixo: 'impacto', pergunta: 'Tornar o atendimento mais rápido ou mais pessoal seria valioso?', opcoes: ['Não é urgente', 'Seria bom', 'É muito importante'] },

  { bloco: 'fontes-receita', eixo: 'prontidao', pergunta: 'Tem serviços com potencial de crescer sem aumentar a equipa na mesma proporção?', opcoes: ['Não', 'Talvez, em parte', 'Sim, claramente'] },
  { bloco: 'fontes-receita', eixo: 'impacto', pergunta: 'É importante encontrar novas formas de gerar receita?', opcoes: ['Não por agora', 'É relevante', 'É uma prioridade'] },

  { bloco: 'atividades-chave', eixo: 'prontidao', pergunta: 'Quanto tempo da equipa se perde com relatórios ou tarefas administrativas repetitivas?', opcoes: ['Pouco', 'Algum', 'Bastante'] },
  { bloco: 'atividades-chave', eixo: 'impacto', pergunta: 'Libertar tempo de tarefas administrativas repetitivas para outras tarefas traria um ganho significativo?', opcoes: ['Pouco ganho', 'Algum ganho', 'Um ganho grande'] },

  { bloco: 'recursos-chave', eixo: 'prontidao', pergunta: 'A equipa tem computadores, internet e à-vontade digital para experimentar novas ferramentas?', opcoes: ['Pouco à-vontade', 'Razoável', 'Muito à-vontade'] },
  { bloco: 'recursos-chave', eixo: 'impacto', pergunta: 'Está pronto para investir em novas ferramentas digitais?', opcoes: ['Ainda não', 'Talvez', 'Sim, estamos prontos'] },

  { bloco: 'parcerias-chave', eixo: 'prontidao', pergunta: 'Já trabalha com fornecedores de tecnologia, cloud, ou consultores externos de informática?', opcoes: ['Não', 'Um pouco', 'Sim, regularmente'] },
  { bloco: 'parcerias-chave', eixo: 'impacto', pergunta: 'Estaria disponível a criar parcerias tecnológicas novas para avançar mais depressa?', opcoes: ['Pouco interesse', 'Talvez', 'Sim, bastante interesse'] },

  { bloco: 'estrutura-custos', eixo: 'prontidao', pergunta: 'Tem visibilidade clara sobre quanto gasta em tarefas manuais ou subscrições?', opcoes: ['Pouca visibilidade', 'Alguma', 'Visibilidade clara'] },
  { bloco: 'estrutura-custos', eixo: 'impacto', pergunta: 'Reduzir custos operacionais é uma prioridade?', opcoes: ['Não muito', 'É relevante', 'É uma prioridade'] }
];

/** Devolve as 18 perguntas no idioma atual — mesma ordem e mesma estrutura nos dois idiomas, só o texto muda. */
function perguntasAtivas() {
  if (obterIdioma() === 'en') return TRADUCOES_I1_EN.perguntasJogo;
  return PERGUNTAS;
}

const REGIOES = ['norte', 'centro', 'lisboa', 'alentejo', 'algarve', 'acores', 'madeira'];
const ESCALOES_JOGO = ['micro', 'pequena', 'media', 'grande'];

// Estado local do percurso do jogo (não confundir com o estado da
// sessão em localStorage, que guarda os dados em si) — só controla em
// que ecrã estamos neste momento.
let fase = 'hook'; // hook | perfil | bloqueio-nao-pme | pergunta | processando | relatorio
let perfilPasso = 0; // 0=setor, 1=colaboradores, 2=faturacao, 3=pais/regiao
let perguntaIndice = 0;
const respostasPerfil = {};

function atualizarBarraProgresso() {
  const totalPassos = 4 + PERGUNTAS.length;
  let passoAtual = 0;
  if (fase === 'perfil') passoAtual = perfilPasso;
  else if (fase === 'pergunta') passoAtual = 4 + perguntaIndice;
  else if (fase === 'processando' || fase === 'relatorio') passoAtual = totalPassos;
  const percentagem = fase === 'hook' ? 0 : Math.round((passoAtual / totalPassos) * 100);
  document.getElementById('barra-progresso').innerHTML =
    `<div class="barra-progresso-preenchida" style="width:${percentagem}%;"></div>`;
}

function render() {
  atualizarBarraProgresso();
  const ecra = document.getElementById('ecra');

  if (fase === 'hook') { ecra.innerHTML = renderHook(); ligarHook(); return; }
  if (fase === 'perfil') { ecra.innerHTML = renderPerfil(); ligarPerfil(); return; }
  if (fase === 'bloqueio-nao-pme') { ecra.innerHTML = renderBloqueioNaoPME(); return; }
  if (fase === 'pergunta') { ecra.innerHTML = renderPergunta(); ligarPergunta(); return; }
  if (fase === 'processando') { ecra.innerHTML = renderProcessando(); setTimeout(() => { fase = 'relatorio'; render(); }, 1600); return; }
  if (fase === 'relatorio') { ecra.innerHTML = renderRelatorio(); ligarRelatorio(); return; }
  if (fase === 'concluido') { ecra.innerHTML = renderConcluido(); return; }
}

function renderHook() {
  return `
    <div class="ecra-pme ecra-pme--hook" style="text-align:center;">
      <span class="eyebrow">${t('pme-eyebrow')}</span>
      <h1 style="font-size:1.6rem;">${t('pme-h1')}</h1>
      <p class="lead" style="font-size:0.95rem;">${t('pme-lead')}</p>
      <div class="valor-destaque">
        <span>${t('pme-tempo')}</span><span>${t('pme-areas')}</span>
      </div>
      <label style="display:flex; gap:10px; align-items:flex-start; text-align:left; cursor:pointer; max-width:440px; margin:0 auto 20px;">
        <input type="checkbox" id="consentimento-pme" style="margin-top:4px;">
        <span style="font-size:0.85rem; color:var(--ink-soft);">${t('pme-consentimento')}</span>
      </label>
      <button class="botao" id="btn-comecar" style="padding:14px 32px;" disabled>${t('pme-comecar')}</button>
    </div>`;
}

function ligarHook() {
  const checkbox = document.getElementById('consentimento-pme');
  const botao = document.getElementById('btn-comecar');
  checkbox.addEventListener('change', () => { botao.disabled = !checkbox.checked; });
  botao.addEventListener('click', () => {
    respostasPerfil.consentimento = true; // só chega aqui se a checkbox estava marcada, já que o botão fica desativado até lá
    fase = 'perfil'; perfilPasso = 0; render();
  });
}

/** Remove o sufixo entre parênteses (ex: "(pequena)") de um rótulo de escalão — usado só neste ecrã, porque a faturação não é o único critério de classificação de PME, e mostrar já uma classificação implícita aqui seria enganoso. O relatório final e o resumo exportado continuam a mostrar o rótulo completo. */
function semClassificacao(rotulo) {
  return rotulo.replace(/\s*\([^)]*\)\s*$/, '');
}

/** Rodapé comum aos 4 ecrãs de perfil — Voltar sempre à esquerda, Continuar sempre à direita (mesma posição em todos os passos, para não obrigar a reaprender a interação a cada ecrã). */
function rodapePerfil(textoContinuar, continuarDesativado) {
  return `
    <div class="acoes-rodape" style="border-top:none; margin-top:20px;">
      <button type="button" class="botao secundario" id="btn-perfil-voltar">${t('voltar')}</button>
      <button type="button" class="botao" id="btn-perfil-continuar" ${continuarDesativado ? 'disabled' : ''}>${textoContinuar}</button>
    </div>`;
}

function renderPerfil() {
  if (perfilPasso === 0) {
    const setores = ['comercio','servicos','industria','construcao','tecnologia','turismo','agricultura','saude','educacao','outro'];
    return `
      <div class="ecra-pme">
        <span class="area-tag">${t('pme-perfil-eyebrow')}</span>
        <h3>${t('pme-setor-pergunta')}</h3>
        <div id="opcoes-perfil">
          ${setores.map(v => `<button type="button" class="opcao-jogo ${v === respostasPerfil.setor ? 'opcao-jogo--selecionada' : ''}" data-valor="${v}">${t('perfil-setor-' + v)}</button>`).join('')}
        </div>
        ${rodapePerfil(t('seguinte'), !respostasPerfil.setor)}
      </div>`;
  }
  if (perfilPasso === 1) {
    return `
      <div class="ecra-pme">
        <span class="area-tag">${t('pme-perfil-eyebrow')}</span>
        <h3>${t('pme-colaboradores-pergunta')}</h3>
        <input type="number" id="input-colaboradores" class="input-grande" min="0" step="1" inputmode="numeric" value="${respostasPerfil.colaboradores ?? ''}" autofocus>
        ${rodapePerfil(t('seguinte'), false)}
      </div>`;
  }
  if (perfilPasso === 2) {
    return `
      <div class="ecra-pme">
        <span class="area-tag">${t('pme-perfil-eyebrow')}</span>
        <h3>${t('pme-faturacao-pergunta')}</h3>
        <div id="opcoes-perfil">
          ${ESCALOES_JOGO.map(v => `<button type="button" class="opcao-jogo ${v === respostasPerfil.faturacao ? 'opcao-jogo--selecionada' : ''}" data-valor="${v}">${semClassificacao(t('perfil-escalao-' + v + (v === 'media' || v === 'grande' ? '-volume' : '')))}</button>`).join('')}
        </div>
        ${rodapePerfil(t('seguinte'), !respostasPerfil.faturacao)}
      </div>`;
  }
  // perfilPasso === 3: pais + regiao
  const paisEscolhido = respostasPerfil.pais;
  const podeContinuar = paisEscolhido === 'europa' || (paisEscolhido === 'pt' && respostasPerfil.regiao);
  return `
    <div class="ecra-pme">
      <span class="area-tag">${t('pme-perfil-eyebrow')}</span>
      <h3>${t('pme-localizacao-pergunta')}</h3>
      <select id="select-pais" class="input-grande">
        <option value="" ${paisEscolhido ? '' : 'selected'} disabled>${t('pme-pais-placeholder')}</option>
        <option value="pt" ${paisEscolhido === 'pt' ? 'selected' : ''}>${t('perfil-pais-pt')}</option>
        <option value="europa" ${paisEscolhido === 'europa' ? 'selected' : ''}>${t('perfil-pais-europa')}</option>
      </select>
      ${paisEscolhido === 'pt' ? `
        <select id="select-regiao" class="input-grande">
          <option value="" ${respostasPerfil.regiao ? '' : 'selected'} disabled>${t('pme-regiao-placeholder')}</option>
          ${REGIOES.map(r => `<option value="${r}" ${respostasPerfil.regiao === r ? 'selected' : ''}>${t('perfil-regiao-' + r)}</option>`).join('')}
        </select>` : ''}
      ${rodapePerfil(t('pme-ver-diagnostico'), !podeContinuar)}
    </div>`;
}

/** Guarda o valor escolhido (setor/faturação) e volta a desenhar o ecrã, só para mostrar a opção destacada — não avança sozinho; é preciso clicar em "Continuar" (ver rodapePerfil). */
function selecionarPerfil(campo, valor) {
  respostasPerfil[campo] = valor;
  render();
}

function finalizarPerfil() {
  const estado = lerEstado();
  estado.perfilUtilizador = 'pme';
  estado.perfilEmpresa = {
    setor: respostasPerfil.setor,
    colaboradores: respostasPerfil.colaboradores,
    criterioFinanceiro: 'volume',
    escalaoFinanceiro: respostasPerfil.faturacao,
    pais: respostasPerfil.pais,
    regiao: respostasPerfil.pais === 'pt' ? (respostasPerfil.regiao || '') : ''
  };
  estado.consentimento = respostasPerfil.consentimento === true;
  guardarEstado(estado);

  const naoPME = classificacaoSME(respostasPerfil.colaboradores, respostasPerfil.faturacao) === 'grande';
  if (naoPME) {
    fase = 'bloqueio-nao-pme';
  } else {
    fase = 'pergunta';
    perguntaIndice = 0;
  }
  render();
}

/** Botão "← Voltar", comum aos 4 passos — no primeiro passo do perfil, volta ao ecrã inicial (hook); nos restantes, ao passo anterior. */
function voltarPerfil() {
  if (perfilPasso === 0) {
    fase = 'hook';
  } else {
    perfilPasso--;
  }
  render();
}

function ligarPerfil() {
  document.querySelectorAll('#opcoes-perfil .opcao-jogo').forEach(botao => {
    botao.addEventListener('click', () => {
      const campo = perfilPasso === 0 ? 'setor' : 'faturacao';
      selecionarPerfil(campo, botao.dataset.valor);
    });
  });

  document.getElementById('btn-perfil-voltar').addEventListener('click', voltarPerfil);

  const continuar = document.getElementById('btn-perfil-continuar');

  if (perfilPasso === 1) {
    const input = document.getElementById('input-colaboradores');
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') continuar.click(); });
    continuar.addEventListener('click', () => {
      const valor = Number(input.value);
      if (!input.value || valor < 0) { input.focus(); return; }
      respostasPerfil.colaboradores = valor;
      perfilPasso++;
      render();
    });
  } else if (perfilPasso === 3) {
    document.getElementById('select-pais').addEventListener('change', (e) => {
      respostasPerfil.pais = e.target.value;
      respostasPerfil.regiao = ''; // muda o país -> a região anterior (se havia) deixa de fazer sentido
      render();
    });
    const selectRegiao = document.getElementById('select-regiao');
    if (selectRegiao) {
      selectRegiao.addEventListener('change', (e) => {
        respostasPerfil.regiao = e.target.value;
        render();
      });
    }
    continuar.addEventListener('click', finalizarPerfil);
  } else {
    continuar.addEventListener('click', () => {
      perfilPasso++;
      render();
    });
  }
}

function renderBloqueioNaoPME() {
  return `
    <div class="ecra-pme" style="text-align:center;">
      <h3>${t('pme-bloqueio-titulo')}</h3>
      <p class="nota">${t('pme-bloqueio-texto')}</p>
      <a class="botao secundario" href="index.html" style="margin-top:12px;">${t('pme-voltar-inicio')}</a>
    </div>`;
}

function renderPergunta() {
  const p = perguntasAtivas()[perguntaIndice];
  const bloco = BMC_BLOCOS.find(b => b.id === p.bloco);
  const total = PERGUNTAS.length;
  const percentagem = Math.round((perguntaIndice / total) * 100);
  return `
    <div class="ecra-pme">
      <div class="progresso-pergunta">
        <div class="progresso-pergunta-barra"><div style="width:${percentagem}%;"></div></div>
        <span class="progresso-pergunta-texto">${t('pme-pergunta-contador').replace('{n}', perguntaIndice + 1).replace('{total}', total)}</span>
      </div>
      <span class="area-tag">${tBloco(bloco).nome}</span>
      <h3 style="margin-bottom:20px;">${p.pergunta}</h3>
      <div id="opcoes-pergunta">
        ${p.opcoes.map((o, i) => `<button type="button" class="opcao-jogo" data-nivel="${i + 1}">${o}</button>`).join('')}
      </div>
    </div>`;
}

function ligarPergunta() {
  document.querySelectorAll('#opcoes-pergunta .opcao-jogo').forEach(botao => {
    botao.addEventListener('click', () => {
      const p = PERGUNTAS[perguntaIndice]; // usa sempre a versão PT como referência dos ids (bloco/eixo são iguais nos dois idiomas)
      const nivel = Number(botao.dataset.nivel);
      if (!respostasPerfil._diagnosticoTemp) respostasPerfil._diagnosticoTemp = {};
      if (!respostasPerfil._diagnosticoTemp[p.bloco]) respostasPerfil._diagnosticoTemp[p.bloco] = {};
      respostasPerfil._diagnosticoTemp[p.bloco][p.eixo] = nivel;

      const par = respostasPerfil._diagnosticoTemp[p.bloco];
      if (par.prontidao && par.impacto) {
        atualizarDiagnostico(p.bloco, par.prontidao, par.impacto);
      }

      perguntaIndice++;
      if (perguntaIndice >= PERGUNTAS.length) {
        fase = 'processando';
      }
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function renderProcessando() {
  return `
    <div class="ecra-pme" style="text-align:center; padding:60px 0;">
      <p class="nota">${t('pme-processando')}</p>
    </div>`;
}

function listaItens(itens) {
  return `<ul style="margin:0; padding-left:18px;">${itens.map(i => `<li>${i}</li>`).join('')}</ul>`;
}

function renderRelatorio() {
  const estado = lerEstado();
  const diagnostico = estado.diagnostico;

  const canvasHTML = BMC_BLOCOS.map(bloco => {
    const r = diagnostico[bloco.id];
    return `
      <div class="bmc-bloco" data-bmc="${bloco.id}">
        <h4>${tBloco(bloco).nome}</h4>
        ${r ? `<span class="selo" data-p="${r.prioridade}">${tPrioridade(r.prioridade)}</span>` : ''}
      </div>`;
  }).join('');

  // As oportunidades prioritárias: blocos "Prioritário" com Ficha
  // disponível ganham destaque com o conteúdo completo da ficha; os
  // restantes blocos com potencial (Prioritário/Relevante sem ficha)
  // aparecem de forma mais resumida, com o conteúdo da Matriz.
  const blocosComPotencial = BMC_BLOCOS.filter(b => {
    const r = diagnostico[b.id];
    return r && (r.prioridade === 'Prioritário' || r.prioridade === 'Relevante');
  }).sort((a, b) => {
    const ordem = { 'Prioritário': 0, 'Relevante': 1 };
    return ordem[diagnostico[a.id].prioridade] - ordem[diagnostico[b.id].prioridade];
  });

  const oportunidadesHTML = blocosComPotencial.length === 0
    ? `<p class="nota">${t('pme-sem-oportunidades')}</p>`
    : blocosComPotencial.map(bloco => {
        const r = diagnostico[bloco.id];
        const conteudo = tBloco(bloco);
        const ficha = bloco.ficha ? tFicha(bloco.id) : null;
        if (ficha) {
          return `
            <div class="cartao">
              <div class="cartao-cabecalho">
                <div><span class="area-tag">${t('pme-oportunidade-tag')}</span><h3 style="margin-bottom:0;">${conteudo.nome}</h3></div>
                <span class="selo" data-p="${r.prioridade}">${tPrioridade(r.prioridade)}</span>
              </div>
              <p><strong>${t('pme-porque-sentido')}:</strong> ${ficha.contexto}</p>
              <p style="margin-bottom:6px;"><strong>${t('pme-o-que-experimentar')}:</strong></p>
              ${listaItens(ficha.aplicacoes)}
              <p style="margin-bottom:6px;"><strong>${t('pme-primeiros-passos')}:</strong></p>
              ${listaItens(ficha.acoes.slice(0, 3))}
              <p class="nota" style="margin-top:14px;">${ficha.governanca}</p>
            </div>`;
        }
        return `
          <div class="cartao">
            <div class="cartao-cabecalho">
              <div><span class="area-tag">${t('pme-oportunidade-tag')}</span><h3 style="margin-bottom:0;">${conteudo.nome}</h3></div>
              <span class="selo" data-p="${r.prioridade}">${tPrioridade(r.prioridade)}</span>
            </div>
            <p style="margin-bottom:6px;"><strong>${t('pme-o-que-experimentar')}:</strong></p>
            ${listaItens(conteudo.matriz.aplicacoes)}
            <p style="margin-bottom:6px;"><strong>${t('pme-pontos-atencao')}:</strong></p>
            ${listaItens(conteudo.matriz.riscos)}
          </div>`;
      }).join('');

  return `
    <div style="max-width:640px; margin:0 auto;">
      <span class="eyebrow">${t('pme-relatorio-eyebrow')}</span>
      <h1 style="font-size:1.6rem;">${t('pme-relatorio-h1')}</h1>
      <p class="lead" style="font-size:0.92rem;">${t('pme-relatorio-lead')}</p>

      <div class="bmc-diagrama">${canvasHTML}</div>

      <h2 style="margin-top:32px;">${t('pme-oportunidades-titulo')}</h2>
      ${oportunidadesHTML}

      <div class="cartao" style="margin-top:32px;">
        <div class="campo">
          <label>${t('pme-satisfacao-percebeu')}</label>
          <div class="opcoes-inline">
            <label><input type="radio" name="satisfacao-percebeu" value="sim"><span>${t('sim')}</span></label>
            <label><input type="radio" name="satisfacao-percebeu" value="nao"><span>${t('nao')}</span></label>
          </div>
        </div>
        <div class="campo" style="margin-bottom:0;">
          <label>${t('pme-satisfacao-util')}</label>
          <div class="opcoes-inline">
            <label><input type="radio" name="satisfacao-util" value="sim"><span>${t('sim')}</span></label>
            <label><input type="radio" name="satisfacao-util" value="nao"><span>${t('nao')}</span></label>
          </div>
        </div>
      </div>

      <div class="acoes-rodape" style="border-top:none; margin-top:32px;">
        <button class="botao secundario" id="btn-descarregar" disabled>${t('pme-descarregar')}</button>
        <button class="botao" id="btn-concluir-pme">${t('pme-concluir')}</button>
      </div>
    </div>`;
}

/** O download só ativa depois de responder às duas perguntas de satisfação — já mapeadas no Apps Script ("Percebeu o resultado"/"Considera útil"), só faltava aqui o lado da recolha. */
function validarSatisfacaoPME() {
  const percebeu = document.querySelector('input[name="satisfacao-percebeu"]:checked');
  const util = document.querySelector('input[name="satisfacao-util"]:checked');
  document.getElementById('btn-descarregar').disabled = !(percebeu && util);
  if (percebeu && util) {
    const estadoAtual = lerEstado();
    estadoAtual.satisfacao = { percebeu: percebeu.value, util: util.value };
    guardarEstado(estadoAtual);
  }
}

/** Depois de descarregar, a avaliação fica fixa — mesmo padrão do painel de especialistas (ver bloquearFormularioAvaliacao em resultados.js). */
function bloquearSatisfacaoPME() {
  document.querySelectorAll('input[name="satisfacao-percebeu"], input[name="satisfacao-util"]').forEach(campo => {
    campo.disabled = true;
  });
  if (document.getElementById('aviso-satisfacao-fixa')) return;
  const aviso = document.createElement('p');
  aviso.id = 'aviso-satisfacao-fixa';
  aviso.className = 'nota';
  aviso.style.cssText = 'font-weight:600; color:var(--uab-azul); margin-top:8px;';
  aviso.textContent = t('pme-satisfacao-fixa');
  document.querySelector('input[name="satisfacao-util"]').closest('.campo').after(aviso);
}

function ligarRelatorio() {
  document.querySelectorAll('input[name="satisfacao-percebeu"], input[name="satisfacao-util"]').forEach(input => {
    input.addEventListener('change', validarSatisfacaoPME);
  });

  // #btn-descarregar e #btn-concluir-pme fazem parte do HTML gerado por
  // renderRelatorio() — recriados de raiz sempre que esta função corre
  // (ex: ao mudar de idioma), por isso têm de se ligar aqui. Os botões
  // dos dois modais (email e confirmação), mais abaixo, são HTML
  // estático da página e só precisam de se ligar uma vez — ver o fim
  // deste ficheiro.
  const botao = document.getElementById('btn-descarregar');
  if (botao) {
    botao.addEventListener('click', () => abrirModalEmail());
  }
  document.getElementById('btn-concluir-pme').addEventListener('click', () => abrirModalConfirmar());
}

/** Abre o modal de email, com o foco a ir para o próprio campo — é a primeira coisa que se preenche. */
function abrirModalEmail() {
  document.getElementById('modal-email-pme').hidden = false;
  document.getElementById('email-pme').focus();
}

function fecharModalEmail() {
  document.getElementById('modal-email-pme').hidden = true;
  document.getElementById('btn-descarregar').focus();
}

/** Abre o modal de confirmação, com o foco a ir para "Cancelar" — a opção mais segura (não destrutiva) por defeito. */
function abrirModalConfirmar() {
  document.getElementById('modal-confirmar-concluir').hidden = false;
  document.getElementById('btn-cancelar-concluir').focus();
}

function fecharModalConfirmar() {
  document.getElementById('modal-confirmar-concluir').hidden = true;
  document.getElementById('btn-concluir-pme').focus();
}

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!document.getElementById('modal-email-pme').hidden) fecharModalEmail();
  if (!document.getElementById('modal-confirmar-concluir').hidden) fecharModalConfirmar();
});

document.getElementById('btn-email-nao').addEventListener('click', async () => {
  fecharModalEmail();
  await descarregarRelatorioPME();
});

document.getElementById('btn-email-sim').addEventListener('click', async () => {
  const campoEmail = document.getElementById('email-pme');
  const email = campoEmail.value.trim();
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const consentimento = document.getElementById('consentimento-email-pme').checked;

  if (email && (!emailValido || !consentimento)) {
    campoEmail.focus();
    return; // exige consentimento explícito se um email for indicado — mas não bloqueia quem preferir não deixar email (esse caso usa o botão "Agora não")
  }

  fecharModalEmail();

  if (email) {
    const estadoAtual = lerEstado();
    estadoAtual.contacto = { email, consentimento: true, guardadoEm: new Date().toISOString() };
    guardarEstado(estadoAtual);
    fetch(GOOGLE_SHEETS_URL_PME, {
      method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ tipo: 'contacto', origem: 'pme', sessionId: estadoAtual.sessionId, email, consentimento: true, data: new Date().toISOString() })
    }).catch(e => console.error('Envio do contacto para a folha de cálculo falhou:', e));
  }

  await descarregarRelatorioPME();
});

document.getElementById('btn-cancelar-concluir').addEventListener('click', fecharModalConfirmar);

document.getElementById('btn-confirmar-concluir').addEventListener('click', () => {
  document.getElementById('modal-confirmar-concluir').hidden = true;
  enviarParaGoogleSheetsPME('terminar');
  limparEstado();
  fase = 'concluido';
  render();
});

/** Descarrega o relatório em HTML e regista o envio — separado do botão em si porque há dois caminhos possíveis até aqui (com ou sem email, ver o modal acima). */
async function descarregarRelatorioPME() {
  const botao = document.getElementById('btn-descarregar');
  botao.disabled = true;
  try {
    const html = await construirRelatorioHTMLPME();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `llm-em-pme-relatorio-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    enviarParaGoogleSheetsPME('descarregar');
    bloquearSatisfacaoPME();
  } finally {
    botao.disabled = false;
  }
}

/**
 * Constrói o relatório da PME como ficheiro HTML autónomo — mesmo
 * conteúdo do ecrã (canvas pintado + oportunidades prioritárias), mas
 * como documento independente (CSS embutido, logótipos em data: URL),
 * para continuar a abrir bem copiado para outro computador.
 */
async function construirRelatorioHTMLPME() {
  const estado = lerEstado();
  const perfil = estado.perfilEmpresa || {};
  const diagnostico = estado.diagnostico;
  const idioma = obterIdioma();
  const dataGeracao = new Date().toLocaleDateString(idioma === 'pt' ? 'pt-PT' : 'en-GB');

  const AREA_GRID_EXPORT = {
    'parcerias-chave': 'parcerias', 'atividades-chave': 'atividades', 'recursos-chave': 'recursos',
    'proposta-valor': 'valor', 'relacionamento-clientes': 'relacionamento', 'canais': 'canais',
    'segmentos-clientes': 'segmentos', 'estrutura-custos': 'custos', 'fontes-receita': 'receita'
  };

  const canvasHTML = BMC_BLOCOS.map(bloco => {
    const r = diagnostico[bloco.id];
    return `
      <div class="bmc-bloco" style="grid-area:${AREA_GRID_EXPORT[bloco.id]};">
        <h4>${tBloco(bloco).nome}</h4>
        ${r ? `<span class="selo" data-p="${r.prioridade}">${tPrioridade(r.prioridade)}</span>` : ''}
      </div>`;
  }).join('');

  const blocosComPotencial = BMC_BLOCOS.filter(b => {
    const r = diagnostico[b.id];
    return r && (r.prioridade === 'Prioritário' || r.prioridade === 'Relevante');
  }).sort((a, b) => {
    const ordem = { 'Prioritário': 0, 'Relevante': 1 };
    return ordem[diagnostico[a.id].prioridade] - ordem[diagnostico[b.id].prioridade];
  });

  const oportunidadesHTML = blocosComPotencial.length === 0
    ? `<p>${t('pme-sem-oportunidades')}</p>`
    : blocosComPotencial.map(bloco => {
        const r = diagnostico[bloco.id];
        const conteudo = tBloco(bloco);
        const ficha = bloco.ficha ? tFicha(bloco.id) : null;
        const linha = (rotulo, itens) => `<p style="margin:10px 0 4px;"><strong>${rotulo}:</strong></p><ul style="margin:0; padding-left:18px;">${itens.map(i => `<li>${i}</li>`).join('')}</ul>`;
        if (ficha) {
          return `
            <div class="oportunidade">
              <h3>${conteudo.nome} — ${tPrioridade(r.prioridade)}</h3>
              <p><strong>${t('pme-porque-sentido')}:</strong> ${ficha.contexto}</p>
              ${linha(t('pme-o-que-experimentar'), ficha.aplicacoes)}
              ${linha(t('pme-primeiros-passos'), ficha.acoes.slice(0, 3))}
              <p class="nota">${ficha.governanca}</p>
            </div>`;
        }
        return `
          <div class="oportunidade">
            <h3>${conteudo.nome} — ${tPrioridade(r.prioridade)}</h3>
            ${linha(t('pme-o-que-experimentar'), conteudo.matriz.aplicacoes)}
            ${linha(t('pme-pontos-atencao'), conteudo.matriz.riscos)}
          </div>`;
      }).join('<hr style="margin:24px 0; border:none; border-top:1px solid #DADDD9;">');

  const [logoUab, logoUtad] = await Promise.all([
    imagemParaDataURL('assets/logo-uab-placeholder.jpeg'),
    imagemParaDataURL('assets/logo-utad-placeholder.jpeg')
  ]);

  const blocoPerfil = perfil.setor ? `
    <table>
      <tr><th>${t('pme-perfil-setor-label')}</th><td>${t('perfil-setor-' + perfil.setor)}</td></tr>
      <tr><th>${t('pme-perfil-colaboradores-label')}</th><td>${perfil.colaboradores}</td></tr>
      <tr><th>${t('pme-perfil-faturacao-label')}</th><td>${rotuloEscalao('volume', perfil.escalaoFinanceiro)}</td></tr>
      <tr><th>${t('classificacao-label')}</th><td>${t('classificacao-valor-' + classificacaoSME(perfil.colaboradores, perfil.escalaoFinanceiro))}</td></tr>
      <tr><th>${t('perfil-pais-label')}</th><td>${perfil.pais === 'pt' ? `${t('perfil-pais-pt')}${perfil.regiao ? ' — ' + t('perfil-regiao-' + perfil.regiao) : ''}` : t('perfil-pais-europa')}</td></tr>
    </table>` : '';

  return `<!DOCTYPE html>
<html lang="${idioma === 'pt' ? 'pt-PT' : 'en'}">
<head>
<meta charset="UTF-8">
<meta name="color-scheme" content="light">
<title>LLM em PME — ${t('pme-relatorio-h1')}</title>
<style>
  html { color-scheme: light; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; max-width: 720px; margin: 40px auto; padding: 0 24px; background: #FFFFFF; color: #16191B; line-height: 1.5; }
  h1 { font-size: 1.6rem; margin-bottom: 4px; }
  h2 { font-size: 1.1rem; margin-top: 32px; border-bottom: 2px solid #6D8297; padding-bottom: 6px; }
  h3 { font-size: 0.98rem; margin-top: 22px; margin-bottom: 4px; }
  .data { color: #52585C; font-size: 0.9rem; margin-bottom: 24px; }
  .nota { color: #52585C; font-size: 0.85rem; }
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
  .bmc-diagrama {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 0.575fr) minmax(0, 0.575fr) minmax(0, 1fr) minmax(0, 1fr);
    grid-template-areas:
      "parcerias  atividades  valor  valor  relacionamento  segmentos"
      "parcerias  recursos    valor  valor  canais          segmentos"
      "custos     custos      custos receita receita        receita";
    gap: 1px; background: #000000; border: 2px solid #000000; margin-top: 12px;
  }
  .bmc-bloco { background: #FFFFFF; padding: 10px; min-width: 0; }
  .bmc-bloco h4 { font-size: 0.74rem; font-weight: 700; line-height: 1.25; margin: 0 0 6px; color: #000000; }
  .selo { display: inline-block; font-family: monospace; font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.03em; padding: 3px 8px; border-radius: 999px; max-width: 100%; white-space: normal; text-align: center; line-height: 1.3; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .selo[data-p="Diferir"] { background: #ECECEA; color: #52585C; }
  .selo[data-p="Relevante"] { background: #DCE2E7; color: #000000; }
  .selo[data-p="Prioritário"] { background: #6D8297; color: #FFFFFF; }
  .selo[data-p="Investimento necessário"] { background: #000000; color: #FFFFFF; }
  @media (max-width: 640px) {
    .bmc-diagrama { grid-template-columns: 1fr; grid-template-areas: none; }
    .bmc-bloco { grid-area: auto !important; padding: 12px; }
  }
  @media print {
    @page { size: A4; margin: 1.8cm; }
    body { margin: 0; max-width: none; }
    *, *::before, *::after { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    h2, h3 { page-break-after: avoid; break-after: avoid-page; }
    .bmc-diagrama, .oportunidade, table, footer { page-break-inside: avoid; break-inside: avoid; }
    a { color: inherit; text-decoration: none; }
  }
</style>
</head>
<body>
  <h1>LLM em PME — ${t('pme-relatorio-h1')}</h1>
  <p class="data">${dataGeracao}</p>
  ${blocoPerfil}

  <div class="bmc-diagrama">${canvasHTML}</div>

  <h2>${t('pme-oportunidades-titulo')}</h2>
  ${oportunidadesHTML}

  <p class="nota" style="margin-top:24px;">${idioma === 'pt'
    ? 'Em caso de dúvidas sobre este relatório ou sobre o estudo, pode contactar o autor através de m2302605@estudante.uab.pt.'
    : 'If you have any questions about this report or the study, you can contact the author at m2302605@estudante.uab.pt.'}</p>

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

function renderConcluido() {
  return `
    <div class="cartao" style="text-align:center; padding:56px 28px; max-width:560px; margin:40px auto;">
      <h2>${t('sessao-terminada-titulo')}</h2>
      <p class="nota">${t('sessao-terminada-agradecimento')}</p>
      <p class="nota">${t('sessao-terminada-texto')}</p>
    </div>`;
}

/**
 * Envio ao Google Sheets — reutiliza o mesmo GOOGLE_SHEETS_URL definido
 * em resultados.js (aqui duplicado por este ficheiro ser independente
 * do resultados.js). Mantém o mesmo tipo "diagnostico" já usado pela
 * folha de cálculo existente.
 */
const GOOGLE_SHEETS_URL_PME = 'https://script.google.com/macros/s/AKfycbwWeHTrITtp3lAA4RsfNMEG0ZOajQTKbwJNQvZor6O3sJzEwehLwx-R1Z31u__wur4/exec';

function enviarParaGoogleSheetsPME(origem) {
  if (!GOOGLE_SHEETS_URL_PME) return;
  const estado = lerEstado();
  const perfil = estado.perfilEmpresa || {};
  const satisfacao = estado.satisfacao || {};
  const diagnosticoLegivel = {};
  BMC_BLOCOS.forEach(bloco => {
    const r = estado.diagnostico[bloco.id];
    if (r) diagnosticoLegivel[bloco.nome] = r.prioridade;
  });
  const simNao = (valor) => valor === 'sim' ? 'Sim' : (valor === 'nao' ? 'Não' : '');
  const payload = {
    tipo: 'diagnostico',
    origem,
    sessionId: estado.sessionId,
    concluidoEm: new Date().toISOString(),
    consentimentoInicial: estado.consentimento ? 'Sim' : 'Não',
    satisfacaoPercebeu: simNao(satisfacao.percebeu),
    satisfacaoUtil: simNao(satisfacao.util),
    perfil: {
      setor: perfil.setor ? t('perfil-setor-' + perfil.setor) : '',
      colaboradores: perfil.colaboradores,
      faturacao: perfil.escalaoFinanceiro ? rotuloEscalao('volume', perfil.escalaoFinanceiro) : '',
      classificacaoSME: (perfil.colaboradores !== undefined && perfil.escalaoFinanceiro) ? t('classificacao-valor-' + classificacaoSME(perfil.colaboradores, perfil.escalaoFinanceiro)) : '',
      pais: perfil.pais === 'pt' ? t('perfil-pais-pt') : (perfil.pais ? t('perfil-pais-europa') : ''),
      regiao: perfil.pais === 'pt' && perfil.regiao ? t('perfil-regiao-' + perfil.regiao) : ''
    },
    diagnostico: diagnosticoLegivel
  };
  fetch(GOOGLE_SHEETS_URL_PME, {
    method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload)
  }).catch(e => console.error('Envio para a folha de cálculo falhou:', e));
}

// Quando o idioma muda, tudo o que está no ecrã neste momento foi
// gerado por JavaScript (não tem data-i18n), por isso é preciso
// desenhar tudo de novo — aplicarTraducoes() (em i18n.js) só trata do
// cabeçalho/rodapé/modal, que têm data-i18n normal.
document.addEventListener('idioma:alterado', render);

render();
