/**
 * cenario.js — três cenários de PME europeia, para pré-preencher o
 * diagnóstico do Instrumento 1 sem obrigar o especialista a responder
 * às 18 perguntas do zero. Cada cenário tem uma história coerente por
 * trás dos números (não são valores aleatórios) e, entre os três,
 * cobre-se toda a gama de classificações possíveis — incluindo um
 * bloco "Prioritário" sem Ficha de Decisão disponível (Parcerias-Chave,
 * no cenário da fábrica), para se poder ver também essa mensagem no
 * Instrumento 2.
 *
 * Prontidão e Impacto ficam fixos aqui; a Prioridade é sempre calculada
 * por classificarBloco() (data.js), nunca escrita à mão — evita ter
 * dois sítios onde a regra de classificação pudesse divergir.
 */
const CENARIOS = {
  'loja-moda': {
    nome: 'Ateliê Marta Nunes',
    decisorPt: 'Marta Nunes, fundadora e gerente há 12 anos, conhece os clientes pelo nome e acompanha pessoalmente cada venda na loja.',
    decisorEn: 'Marta Nunes, founder and manager for 12 years, knows customers by name and personally handles every sale in the shop.',
    perfilEmpresa: { setor: 'comercio', colaboradores: 8, criterioFinanceiro: 'volume', escalaoFinanceiro: 'micro', pais: 'pt', regiao: 'norte' },
    // Loja física com clientela fiel e presencial, mas quase nenhuma presença digital.
    blocos: {
      'segmentos-clientes': [3, 2],       // conhece bem os clientes, mas de forma informal
      'proposta-valor': [2, 2],
      'canais': [1, 3],                   // praticamente sem presença digital — impacto alto
      'relacionamento-clientes': [3, 1],  // já muito pessoal, pouca urgência
      'fontes-receita': [2, 2],
      'atividades-chave': [2, 3],         // gestão de catálogo/stock consome muito tempo
      'recursos-chave': [1, 2],
      'parcerias-chave': [2, 1],
      'estrutura-custos': [2, 2]
    }
  },
  'consultoria': {
    nome: 'Vantagem Consulting',
    decisorPt: 'João Marques, sócio-gerente, lidera uma equipa jovem e tecnologicamente à-vontade, mas sente que os relatórios internos consomem tempo a mais.',
    decisorEn: 'João Marques, managing partner, leads a young, digitally comfortable team, but feels internal reporting takes up too much time.',
    perfilEmpresa: { setor: 'servicos', colaboradores: 25, criterioFinanceiro: 'volume', escalaoFinanceiro: 'pequena', pais: 'pt', regiao: 'lisboa' },
    // Equipa digitalmente à-vontade, mas sobrecarregada com relatórios e tarefas administrativas.
    blocos: {
      'segmentos-clientes': [3, 2],
      'proposta-valor': [3, 2],
      'canais': [3, 1],                   // já bem estruturado
      'relacionamento-clientes': [2, 3],  // CRM disperso, alto valor em melhorar
      'fontes-receita': [2, 2],
      'atividades-chave': [2, 3],         // relatórios e propostas consomem imenso tempo
      'recursos-chave': [3, 2],
      'parcerias-chave': [3, 1],
      'estrutura-custos': [2, 2]
    }
  },
  'fabrica': {
    nome: 'Metalúrgica Ferreira & Filhos',
    decisorPt: 'Carlos Ferreira, administrador há duas décadas, valoriza a experiência da equipa mas reconhece o atraso tecnológico da fábrica.',
    decisorEn: 'Carlos Ferreira, managing director for two decades, values his team\'s experience but recognises the factory\'s technological lag.',
    perfilEmpresa: { setor: 'industria', colaboradores: 40, criterioFinanceiro: 'volume', escalaoFinanceiro: 'pequena', pais: 'pt', regiao: 'centro' },
    // Indústria tradicional, baixa maturidade digital na maioria dos blocos.
    blocos: {
      'segmentos-clientes': [2, 1],       // B2B estável, poucos clientes
      'proposta-valor': [2, 1],
      'canais': [1, 1],                   // relação direta, pouca necessidade
      'relacionamento-clientes': [2, 2],
      'fontes-receita': [1, 2],
      'atividades-chave': [1, 3],         // processos manuais pesados
      'recursos-chave': [1, 3],           // infraestrutura digital quase inexistente
      'parcerias-chave': [2, 3],          // fornecedores tecnológicos ajudariam muito — sem Ficha disponível
      'estrutura-custos': [2, 2]
    }
  }
};

/**
 * Desenha a ficha de cada cenário (nome da empresa, setor, colaboradores,
 * faturação, região, e uma frase sobre o sócio-gestor) — os mesmos
 * rótulos e escalões já usados no resto do site (perfil-setor-*,
 * perfil-escalao-*, perfil-regiao-*), para nunca haver dois textos
 * diferentes para a mesma coisa.
 */
function renderCartoesCenarios() {
  const idioma = obterIdioma();
  const html = Object.entries(CENARIOS).map(([id, c]) => {
    const p = c.perfilEmpresa;
    const decisor = idioma === 'pt' ? c.decisorPt : c.decisorEn;
    return `
      <button type="button" class="cartao-escolha" data-cenario="${id}">
        <span class="area-tag">${t('cenario-a-tag')}</span>
        <h3>${c.nome}</h3>
        <ul class="nota" style="list-style:none; padding:0; margin:8px 0 12px; display:grid; gap:2px;">
          <li><strong>${t('perfil-setor-label')}:</strong> ${t('perfil-setor-' + p.setor)}</li>
          <li><strong>${t('cenario-colaboradores-label')}:</strong> ${p.colaboradores}</li>
          <li><strong>${t('cenario-faturacao-label')}:</strong> ${t('perfil-escalao-' + p.escalaoFinanceiro)}</li>
          <li><strong>${t('cenario-regiao-label')}:</strong> ${t('perfil-regiao-' + p.regiao)}</li>
        </ul>
        <p class="nota">${decisor}</p>
        <span class="cartao-escolha-cta">${t('cenario-usar-cta')}</span>
      </button>`;
  }).join('');
  document.getElementById('cartoes-cenarios').innerHTML = html;

  document.querySelectorAll('[data-cenario]').forEach(botao => {
    botao.addEventListener('click', () => aplicarCenario(botao.dataset.cenario));
  });
}

function aplicarCenario(idCenario) {
  const definicao = CENARIOS[idCenario];
  if (!definicao) return;

  const estado = lerEstado();
  estado.perfilEmpresa = { ...definicao.perfilEmpresa };
  estado.diagnostico = {};
  Object.entries(definicao.blocos).forEach(([blocoId, par]) => {
    const [prontidao, impacto] = par;
    estado.diagnostico[blocoId] = { prontidao, impacto, prioridade: classificarBloco(prontidao, impacto) };
  });
  guardarEstado(estado);
  window.location.href = 'instrumento1.html';
}

document.getElementById('escolha-autonomo').addEventListener('click', () => {
  window.location.href = 'instrumento1.html';
});

document.addEventListener('idioma:alterado', renderCartoesCenarios);
renderCartoesCenarios();
