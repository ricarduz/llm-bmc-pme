/**
 * Dados dos três instrumentos do framework.
 * Fonte: Apêndice "Instrumentos" da dissertação (Ricardo Serafim, UAb/UTAD).
 * Conteúdo marcado com "[A INTEGRAR]" ainda não foi confirmado contra o
 * texto da tese e não deve ser tratado como definitivo.
 */

const AREAS = {
  'interface-cliente': 'Interface com o Cliente',
  'produto-oferta': 'Produto/Oferta',
  'gestao-infraestrutura': 'Gestão de Infraestrutura',
  'aspetos-financeiros': 'Aspetos Financeiros'
};

const BMC_BLOCOS = [
  {
    id: 'segmentos-clientes',
    nome: 'Segmentos de Clientes',
    area: 'interface-cliente',
    ficha: false,
    indicadores: [
      'Existem dados estruturados sobre clientes (e.g., CRM)?',
      'Segmenta ou diferencia clientes por perfil ou necessidade?',
      'Capacidade de registar e analisar interações com clientes?'
    ]
  },
  {
    id: 'proposta-valor',
    nome: 'Proposta de Valor',
    area: 'produto-oferta',
    ficha: false,
    indicadores: [
      'A proposta de valor inclui personalização ou serviço diferenciado?',
      'Existe produção regular de conteúdos comerciais?',
      'Necessidade de adaptação frequente da oferta ao cliente?'
    ]
  },
  {
    id: 'canais',
    nome: 'Canais',
    area: 'interface-cliente',
    ficha: true,
    indicadores: [
      'Utiliza canais digitais para comunicar com clientes (email, redes sociais)?',
      'Há plataformas de atendimento ou comunicação já implementadas?',
      'Existem perguntas frequentes nesses canais?'
    ]
  },
  {
    id: 'relacionamento-clientes',
    nome: 'Relacionamento com Clientes',
    area: 'interface-cliente',
    ficha: true,
    indicadores: [
      'Existe serviço de apoio ao cliente com volume de interações regular?',
      'Há processos de acompanhamento pós-venda ou fidelização definidos?',
      'Regista reclamações ou comentários de forma estruturada?'
    ]
  },
  {
    id: 'fontes-receita',
    nome: 'Fontes de Receita',
    area: 'aspetos-financeiros',
    ficha: false,
    indicadores: [
      'Existem serviços digitais com potencial de escala?',
      'Tem capacidade de introduzir novos modelos de serviço baseados em dados?',
      'Existem processos comerciais ou de conversão que podem ser otimizados por comunicação personalizada?'
    ]
  },
  {
    id: 'atividades-chave',
    nome: 'Atividades-Chave',
    area: 'gestao-infraestrutura',
    ficha: true,
    indicadores: [
      'Existem atividades intensivas em linguagem (relatórios, comunicações)?',
      'Há tarefas administrativas repetitivas com elevado volume de documentos?',
      'Os processos operacionais estão minimamente documentados?'
    ]
  },
  {
    id: 'recursos-chave',
    nome: 'Recursos-Chave',
    area: 'gestao-infraestrutura',
    ficha: true,
    indicadores: [
      'Dispõe de infraestrutura digital básica (computadores, ligação à internet)?',
      'Pelo menos um colaborador tem literacia digital para operar LLM?',
      'Existe documentação interna ou base de conhecimento organizada (manuais, FAQs, processos, contratos)?'
    ]
  },
  {
    id: 'parcerias-chave',
    nome: 'Parcerias-Chave',
    area: 'gestao-infraestrutura',
    ficha: false,
    indicadores: [
      'Trabalha com fornecedores tecnológicos ou consultores externos?',
      'Existem relações com plataformas cloud ou de software como serviço (SaaS)?',
      'Há abertura para estabelecer novos acordos com fornecedores de IA?'
    ]
  },
  {
    id: 'estrutura-custos',
    nome: 'Estrutura de Custos',
    area: 'aspetos-financeiras',
    ficha: false,
    indicadores: [
      'Existem custos elevados associados a tarefas manuais ou repetitivas?',
      'Tem capacidade de absorver custos de subscrição recorrentes (SaaS)?',
      'Há mecanismos de controlo ou monitorização de custos operacionais?'
    ]
  }
];

// Corrige o id de área do último bloco (erro de escrita evitado)
BMC_BLOCOS.find(b => b.id === 'estrutura-custos').area = 'aspetos-financeiros';

const PRONTIDAO_DEF = {
  3: 'Condições presentes, estruturadas e utilizáveis.',
  2: 'Condições existem de forma parcial, informal ou inconsistente.',
  1: 'Condições ausentes ou inutilizáveis no estado atual.'
};

const IMPACTO_DEF = {
  3: 'Bloco crítico, problemas operacionais visíveis ou margem de ganho significativa.',
  2: 'Bloco relevante, com margem de melhoria moderada.',
  1: 'Bloco estável, sem problemas operacionais relevantes.'
};

// Tabela 7 — Quadro de classificações de prioridade (Instrumento 1)
const MATRIZ_PRIORIDADE = {
  3: { 1: 'Diferir', 2: 'Relevante', 3: 'Prioritário' },
  2: { 1: 'Diferir', 2: 'Relevante', 3: 'Prioritário' },
  1: { 1: 'Diferir', 2: 'Diferir', 3: 'Investimento necessário' }
};

const DESCRICAO_PRIORIDADE = {
  'Prioritário': 'Avançar para a Matriz LLM × BMC com prioridade.',
  'Relevante': 'Potencial identificado; avaliar na Matriz LLM × BMC.',
  'Investimento necessário': 'Alto impacto bloqueado por baixa prontidão; reforçar condições de base (infraestrutura, dados, competências) antes de avançar.',
  'Diferir': 'Prioridade baixa no contexto atual da PME.'
};

function classificarBloco(prontidao, impacto) {
  return MATRIZ_PRIORIDADE[prontidao][impacto];
}

// Instrumento 3 — Fichas de Decisão (apenas 4 blocos têm ficha completa)
const FICHAS = {
  'recursos-chave': {
    titulo: 'Recursos-Chave',
    area: 'III - Gestão de Infraestrutura',
    requisitos: 'RF1 · RF2 · RF3 · RF4',
    contexto: 'Os Recursos-Chave descrevem os ativos mais importantes que a PME necessita para que o seu modelo de negócio funcione. A adoção de LLM implica a incorporação de novos recursos tecnológicos e intelectuais — APIs, infraestrutura cloud, competências de engenharia de prompts e bases de conhecimento organizacional — que alteram o perfil de recursos da organização. Este bloco é simultaneamente um pré-requisito e um resultado da adoção: a PME precisa de recursos mínimos para adotar LLM e, ao adotá-los, constrói novos recursos.',
    aplicacoes: [
      'Integração de APIs LLM como recurso tecnológico central nos processos operacionais',
      'Construção de base de conhecimento organizacional estruturada e pesquisável com IA',
      'Desenvolvimento de competências internas na criação de prompts e supervisão de outputs',
      'Criação de repositório de prompts e templates reutilizáveis por função ou processo'
    ],
    orientacaoTecnologica: [
      {
        opcao: 'API comercial como recurso base',
        quando: 'PME sem capacidade de desenvolvimento interno; prioridade de velocidade de implementação',
        consideracoes: 'Menor custo inicial; dependência externa; avaliar continuidade e condições de serviço do fornecedor'
      },
      {
        opcao: 'RAG como recurso de conhecimento',
        quando: 'PME com conhecimento organizacional valioso disperso em documentos',
        consideracoes: 'Transforma documentação existente em recurso pesquisável; investimento moderado; alto retorno em PMEs intensivas em conhecimento'
      },
      {
        opcao: 'Infraestrutura própria',
        quando: 'PME com requisitos de privacidade elevados ou volume que justifica investimento',
        consideracoes: 'Maior controlo e independência; requer competências técnicas ou parceiro externo de suporte'
      }
    ],
    acoes: [
      'Auditar os recursos tecnológicos existentes face aos requisitos mínimos de adoção LLM',
      'Selecionar e contratar o fornecedor de API ou plataforma LLM adequado ao perfil da PME',
      'Identificar e formar o colaborador responsável pela gestão e supervisão das ferramentas LLM',
      'Construir o repositório inicial de prompts validados para as tarefas prioritárias identificadas',
      'Definir política interna de utilização e limites de autonomia das ferramentas LLM'
    ],
    criterios: [
      { criterio: 'Disponibilidade', indicador: 'Uptime e fiabilidade do serviço LLM integrado nos processos' },
      { criterio: 'Competência interna', indicador: 'Número de colaboradores com capacidade de utilização autónoma das ferramentas' },
      { criterio: 'Custo-benefício', indicador: 'Custo mensal de subscrição/API face ao valor gerado (horas poupadas, outputs produzidos)' },
      { criterio: 'Independência', indicador: 'Grau de lock-in: facilidade de migração entre fornecedores se necessário' }
    ],
    governanca: 'RGPD: os contratos com fornecedores de API devem incluir cláusulas de subcontratante de tratamento de dados quando aplicável. Verificar onde os dados são processados e armazenados geograficamente.'
  },
  'canais': { titulo: 'Canais', area: 'I - Interface com o Cliente', pendente: true },
  'relacionamento-clientes': { titulo: 'Relacionamento com Clientes', area: 'I - Interface com o Cliente', pendente: true },
  'atividades-chave': { titulo: 'Atividades-Chave', area: 'III - Gestão de Infraestrutura', pendente: true }
};
