/**
 * Seletor de idioma PT/EN.
 * Marca qualquer elemento traduzível com data-i18n="chave" e regista o
 * texto correspondente em TRADUCOES.pt / TRADUCOES.en, abaixo.
 * A preferência de idioma é guardada em localStorage e aplica-se a todas
 * as páginas que incluírem este ficheiro.
 */

const IDIOMA_KEY = 'llm-bmc-pme:idioma';

const TRADUCOES = {
  pt: {
    'titulo-pagina': 'Framework de adoção de LLM em PME',
    'meta-descricao': 'Ferramenta interativa de demonstração do framework de adoção de Large Language Models por PME, estruturado no Business Model Canvas.',
    'eyebrow': 'Instrumento de demonstração · dissertação de Mestrado',
    'h1': 'Um percurso guiado para decidir onde os LLM fazem sentido na sua PME',
    'lead': 'Esta ferramenta instancia sequencialmente os três instrumentos do framework de apoio à adoção de Large Language Models (LLM) por Pequenas e Médias Empresas, estruturado no Business Model Canvas (BMC). Responde, por esta ordem, a três perguntas.',
    'card1-titulo': '1. A minha empresa está pronta?',
    'card1-nota': 'Instrumento 1 — Diagnóstico de Pré-requisitos. Avalia, bloco a bloco, a prontidão operacional e a criticidade de cada área do seu negócio.',
    'card2-titulo': '2. Onde faz sentido para a minha PME?',
    'card2-nota': 'Instrumento 2 — Matriz LLM × BMC. Mapeia aplicações, oportunidades e riscos nos blocos identificados como prioritários.',
    'card3-titulo': '3. Como avanço neste bloco?',
    'card3-nota': 'Instrumento 3 — Fichas de Decisão. Orientação tecnológica e ações concretas para os blocos com maior densidade de evidência empírica.',
    'antes-titulo': 'Antes de começar',
    'antes-texto': 'As respostas ficam guardadas apenas neste navegador enquanto usa a ferramenta. No final, pode exportar os resultados; nenhum dado pessoal identificativo é recolhido por defeito.',
    'antes-consentimento': 'Li o parágrafo acima e pretendo iniciar o diagnóstico.',
    'botao-iniciar': 'Iniciar diagnóstico →',
    'rodape-texto': 'Dissertação de Mestrado em Engenharia Informática e Tecnologia Web (Universidade Aberta, Universidade de Trás-os-Montes e Alto Douro)',
    'i1-eyebrow': 'Instrumento 1 de 3',
    'i1-h1': 'Diagnóstico de Pré-requisitos',
    'i1-lead': 'Avalie cada bloco do BMC nos eixos <strong>Prontidão</strong> e <strong>Impacto</strong>, numa escala de 1 (Baixo) a 3 (Alto), tendo a sua PME como referência. Os indicadores servem apenas para orientar a reflexão — a classificação final é a sua avaliação global do bloco.',
    'i1-eixo-prontidao': 'Prontidão — em que medida a PME dispõe destas condições?',
    'i1-eixo-impacto': 'Impacto — quão crítico é este bloco para o desempenho atual?',
    'i1-por-avaliar': 'por avaliar',
    'i1-com-ficha': ' · com Ficha de Decisão',
    'i1-progresso': ' de 9 blocos avaliados',
    'i1-continuar': 'Continuar para a Matriz LLM × BMC →',
    'i1-limpar': 'Limpar respostas',
    'i1-limpar-confirmar': 'Isto apaga todas as respostas do diagnóstico guardadas neste navegador. Continuar?',
    'i1-resumo-titulo': 'Resultado global do diagnóstico',
    'i1-resumo-lead': 'Perfil de prioridade dos nove blocos do BMC, resultante das suas respostas.',
    'th-bloco': 'Bloco BMC',
    'th-prontidao': 'Prontidão',
    'th-impacto': 'Impacto',
    'th-prioridade': 'Prioridade',
    'aviso-consentimento': 'Confirme que leu o texto acima para poder iniciar.',
    'aviso-diagnostico': 'Responda aos 9 blocos para ver o resultado global e continuar.',
    'sobre-titulo': 'Sobre este projeto',
    'sobre-autor-titulo': 'Sobre o autor',
    'sobre-autor-texto': '[Escreva aqui uma breve apresentação sua — percurso profissional e motivação para investigar este tema.]',
    'sobre-tese-titulo': 'Sobre a tese em curso',
    'sobre-tese-texto': 'Esta ferramenta é o artefacto central da dissertação <em>Adoção de Large Language Models por Pequenas e Médias Empresas: Desafios e Oportunidades</em>, para obtenção do grau de Mestre em Engenharia Informática e Tecnologia Web pela Universidade Aberta, em parceria com a UTAD, sob orientação do Prof. Doutor Frederico Branco.',
    'modal-fechar': 'Fechar',
    'exp-i1-titulo': 'Instrumento 1 — Diagnóstico de Pré-requisitos',
    'exp-i1-texto': 'Constitui o ponto de entrada obrigatório do framework. Avalia, bloco a bloco do Business Model Canvas, a prontidão operacional da PME e a criticidade desse bloco para o desempenho atual do negócio. O cruzamento dos dois eixos — Prontidão e Impacto — gera uma matriz de decisão 3×3 que classifica cada bloco em quatro níveis: Prioritário, Relevante, Investimento necessário ou Diferir. O resultado alimenta diretamente o Instrumento 2. Operacionaliza os requisitos funcionais RF1, RF3 e RF4.',
    'exp-i2-titulo': 'Instrumento 2 — Matriz LLM × BMC',
    'exp-i2-texto': 'Mapeia panoramicamente as aplicações, oportunidades e riscos da adoção de LLM nos nove blocos do BMC, organizados em quatro áreas agregadas (Interface com o Cliente, Produto/Oferta, Gestão de Infraestrutura e Aspetos Financeiros). A partir dos blocos sinalizados no diagnóstico, identifica onde a adoção gera mais valor e seleciona os blocos a aprofundar. Operacionaliza o requisito funcional RF2.',
    'exp-i3-titulo': 'Instrumento 3 — Fichas de Decisão por Bloco BMC',
    'exp-i3-texto': 'O instrumento operacional mais aprofundado do framework, ativado de forma condicional para os blocos classificados como Prioritário ou Relevante que disponham de ficha completa: Canais, Relacionamento com Clientes, Atividades-Chave e Recursos-Chave. Cada ficha organiza-se em seis secções — contexto do bloco, aplicações LLM prioritárias, orientação tecnológica, ações concretas, critérios de avaliação, e conformidade e governança. Operacionaliza os requisitos funcionais RF1, RF2, RF3 e RF4.'
  },
  en: {
    'titulo-pagina': 'Framework for LLM Adoption in SMEs',
    'meta-descricao': 'Interactive demonstration tool for a framework supporting SME adoption of Large Language Models, structured around the Business Model Canvas.',
    'eyebrow': 'Demonstration instrument · MSc dissertation',
    'h1': 'A guided path to deciding where LLMs make sense in your SME',
    'lead': 'This tool sequentially instantiates the three instruments of the framework supporting the adoption of Large Language Models (LLMs) by Small and Medium-sized Enterprises (SMEs), structured around the Business Model Canvas (BMC). It answers, in this order, three questions.',
    'card1-titulo': '1. Is my company ready?',
    'card1-nota': 'Instrument 1 — Prerequisite Diagnostic. Assesses, block by block, operational readiness and the criticality of each area of your business.',
    'card2-titulo': '2. Where does it make sense for my SME?',
    'card2-nota': 'Instrument 2 — LLM × BMC Matrix. Maps applications, opportunities and risks across the blocks identified as priorities.',
    'card3-titulo': '3. How do I move forward on this block?',
    'card3-nota': 'Instrument 3 — Decision Sheets. Technology guidance and concrete actions for the blocks with the strongest empirical evidence base.',
    'antes-titulo': 'Before you start',
    'antes-texto': 'Your answers are stored only in this browser while you use the tool. At the end, you can export the results; no identifying personal data is collected by default.',
    'antes-consentimento': 'I have read the paragraph above and wish to start the diagnostic.',
    'botao-iniciar': 'Start diagnostic →',
    'rodape-texto': 'MSc Dissertation in Computer Engineering and Web Technology (Universidade Aberta, Universidade de Trás-os-Montes e Alto Douro)',
    'i1-eyebrow': 'Instrument 1 of 3',
    'i1-h1': 'Prerequisite Diagnostic',
    'i1-lead': 'Assess each BMC block on the <strong>Readiness</strong> and <strong>Impact</strong> axes, on a scale from 1 (Low) to 3 (High), using your SME as the reference. The indicators are only meant to guide your reflection — the final classification is your overall assessment of the block.',
    'i1-eixo-prontidao': 'Readiness — to what extent does the SME have these conditions in place?',
    'i1-eixo-impacto': 'Impact — how critical is this block to current performance?',
    'i1-por-avaliar': 'not yet assessed',
    'i1-com-ficha': ' · has a Decision Sheet',
    'i1-progresso': ' of 9 blocks assessed',
    'i1-continuar': 'Continue to the LLM × BMC Matrix →',
    'i1-limpar': 'Clear answers',
    'i1-limpar-confirmar': 'This clears all diagnostic answers saved in this browser. Continue?',
    'i1-resumo-titulo': 'Overall diagnostic result',
    'i1-resumo-lead': 'Priority profile for the nine BMC blocks, based on your answers.',
    'th-bloco': 'BMC Block',
    'th-prontidao': 'Readiness',
    'th-impacto': 'Impact',
    'th-prioridade': 'Priority',
    'aviso-consentimento': 'Confirm you have read the text above to start.',
    'aviso-diagnostico': 'Answer all 9 blocks to see the overall result and continue.',
    'sobre-titulo': 'About this project',
    'sobre-autor-titulo': 'About the author',
    'sobre-autor-texto': '[Write a short introduction here — professional background and motivation for researching this topic.]',
    'sobre-tese-titulo': 'About the ongoing dissertation',
    'sobre-tese-texto': 'This tool is the central artefact of the dissertation <em>Adoption of Large Language Models by Small and Medium-sized Enterprises: Challenges and Opportunities</em>, submitted for the degree of Master in Computer Engineering and Web Technology at Universidade Aberta, in partnership with UTAD, supervised by Prof. Dr. Frederico Branco.',
    'modal-fechar': 'Close',
    'exp-i1-titulo': 'Instrument 1 — Prerequisite Diagnostic',
    'exp-i1-texto': 'The mandatory entry point of the framework. Assesses, block by block of the Business Model Canvas, the SME\'s operational readiness and how critical that block is to current business performance. Crossing the two axes — Readiness and Impact — produces a 3×3 decision matrix that classifies each block into four levels: Priority, Relevant, Investment needed, or Defer. The result feeds directly into Instrument 2. Operationalises functional requirements RF1, RF3 and RF4.',
    'exp-i2-titulo': 'Instrument 2 — LLM × BMC Matrix',
    'exp-i2-texto': 'Provides a panoramic map of the applications, opportunities and risks of LLM adoption across the nine BMC blocks, organised into four aggregated areas (Customer Interface, Product/Offering, Infrastructure Management, and Financial Aspects). Based on the blocks flagged in the diagnostic, it identifies where adoption generates the most value and selects the blocks to explore further. Operationalises functional requirement RF2.',
    'exp-i3-titulo': 'Instrument 3 — Decision Sheets by BMC Block',
    'exp-i3-texto': 'The framework\'s most in-depth operational instrument, activated conditionally for blocks classified as Priority or Relevant that have a complete sheet available: Channels, Customer Relationships, Key Activities, and Key Resources. Each sheet is organised into six sections — block context, priority LLM applications, technology guidance, concrete actions, evaluation criteria, and compliance and governance. Operationalises functional requirements RF1, RF2, RF3 and RF4.'
  }
};

/**
 * Tradução do conteúdo dinâmico do Instrumento 1 (blocos, indicadores,
 * áreas, definições de escala). O português vem sempre de data.js
 * (fonte canónica, ligada ao Apêndice de Instrumentos); aqui só se regista
 * a versão inglesa, usada quando obterIdioma() === 'en'.
 */
const TRADUCOES_I1_EN = {
  areas: {
    'interface-cliente': 'Customer Interface',
    'produto-oferta': 'Product/Offering',
    'gestao-infraestrutura': 'Infrastructure Management',
    'aspetos-financeiros': 'Financial Aspects'
  },
  blocos: {
    'segmentos-clientes': {
      nome: 'Customer Segments',
      indicadores: [
        'Is there structured customer data (e.g., CRM)?',
        'Do you segment or differentiate customers by profile or need?',
        'Can you record and analyse customer interactions?'
      ]
    },
    'proposta-valor': {
      nome: 'Value Proposition',
      indicadores: [
        'Does the value proposition include personalisation or differentiated service?',
        'Is there regular production of commercial content?',
        'Is there a frequent need to adapt the offer to the customer?'
      ]
    },
    'canais': {
      nome: 'Channels',
      indicadores: [
        'Do you use digital channels to communicate with customers (email, social media)?',
        'Are there service or communication platforms already in place?',
        'Are there frequently asked questions on those channels?'
      ]
    },
    'relacionamento-clientes': {
      nome: 'Customer Relationships',
      indicadores: [
        'Is there a customer support service with a regular volume of interactions?',
        'Are there defined after-sales follow-up or loyalty processes?',
        'Are complaints or comments recorded in a structured way?'
      ]
    },
    'fontes-receita': {
      nome: 'Revenue Streams',
      indicadores: [
        'Are there digital services with potential to scale?',
        'Can you introduce new data-based service models?',
        'Are there sales or conversion processes that could be improved by personalised communication?'
      ]
    },
    'atividades-chave': {
      nome: 'Key Activities',
      indicadores: [
        'Are there language-intensive activities (reports, communications)?',
        'Are there repetitive administrative tasks with a high volume of documents?',
        'Are operational processes at least minimally documented?'
      ]
    },
    'recursos-chave': {
      nome: 'Key Resources',
      indicadores: [
        'Do you have basic digital infrastructure (computers, internet access)?',
        'Does at least one employee have the digital literacy to operate an LLM?',
        'Is there organised internal documentation or a knowledge base (manuals, FAQs, processes, contracts)?'
      ]
    },
    'parcerias-chave': {
      nome: 'Key Partnerships',
      indicadores: [
        'Do you work with technology suppliers or external consultants?',
        'Are there relationships with cloud or Software-as-a-Service (SaaS) platforms?',
        'Is there openness to establishing new agreements with AI suppliers?'
      ]
    },
    'estrutura-custos': {
      nome: 'Cost Structure',
      indicadores: [
        'Are there high costs associated with manual or repetitive tasks?',
        'Can you absorb recurring subscription costs (SaaS)?',
        'Are there mechanisms to control or monitor operational costs?'
      ]
    }
  },
  prontidao: {
    3: 'Conditions are in place, structured and usable.',
    2: 'Conditions exist partially, informally or inconsistently.',
    1: 'Conditions are absent or unusable in the current state.'
  },
  impacto: {
    3: 'Critical block, visible operational problems or significant room for gain.',
    2: 'Relevant block, with moderate room for improvement.',
    1: 'Stable block, no relevant operational problems.'
  },
  prioridade: {
    'Diferir': 'Defer',
    'Relevante': 'Relevant',
    'Prioritário': 'Priority',
    'Investimento necessário': 'Investment needed'
  }
};

function t(chave) {
  const dicionario = TRADUCOES[obterIdioma()] || TRADUCOES.pt;
  return dicionario[chave] || chave;
}

function tArea(id) {
  if (obterIdioma() === 'en') return TRADUCOES_I1_EN.areas[id] || AREAS[id];
  return AREAS[id];
}

function tBloco(bloco) {
  if (obterIdioma() === 'en' && TRADUCOES_I1_EN.blocos[bloco.id]) return TRADUCOES_I1_EN.blocos[bloco.id];
  return { nome: bloco.nome, indicadores: bloco.indicadores };
}

function tEscala(eixo, valor) {
  if (obterIdioma() === 'en') return TRADUCOES_I1_EN[eixo][valor];
  return (eixo === 'prontidao' ? PRONTIDAO_DEF : IMPACTO_DEF)[valor];
}

function tPrioridade(p) {
  if (obterIdioma() === 'en') return TRADUCOES_I1_EN.prioridade[p] || p;
  return p;
}

function obterIdioma() {
  return localStorage.getItem(IDIOMA_KEY) || 'pt';
}

function definirIdioma(idioma) {
  localStorage.setItem(IDIOMA_KEY, idioma);
}

function aplicarTraducoes() {
  const idioma = obterIdioma();
  const dicionario = TRADUCOES[idioma] || TRADUCOES.pt;

  document.documentElement.lang = idioma === 'pt' ? 'pt-PT' : 'en';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const chave = el.getAttribute('data-i18n');
    if (dicionario[chave]) el.innerHTML = dicionario[chave];
  });

  const metaDescricao = document.getElementById('meta-descricao');
  if (metaDescricao && dicionario['meta-descricao']) {
    metaDescricao.setAttribute('content', dicionario['meta-descricao']);
  }

  document.querySelectorAll('.seletor-idioma button').forEach(botao => {
    botao.classList.toggle('ativo', botao.dataset.lang === idioma);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  aplicarTraducoes();
  document.querySelectorAll('.seletor-idioma button').forEach(botao => {
    botao.addEventListener('click', () => {
      definirIdioma(botao.dataset.lang);
      aplicarTraducoes();
      document.dispatchEvent(new CustomEvent('idioma:alterado'));
    });
  });
});
