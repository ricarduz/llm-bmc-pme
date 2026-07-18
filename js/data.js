/**
 * Dados dos três instrumentos do framework.
 * Fonte: Apêndice "Instrumentos" da dissertação (Ricardo Serafim, UAb/UTAD).
 * Instrumento 1, Instrumento 2 (Tabela 10) e as 4 Fichas de Decisão do
 * Instrumento 3 (Canais, Relacionamento com Clientes, Atividades-Chave,
 * Recursos-Chave) já confirmados e completos. Tradução EN ainda cobre
 * apenas Instrumento 1 e a Matriz do Instrumento 2 — as Fichas do
 * Instrumento 3 estão, por agora, só em português.
 */

// As 4 áreas agregadas em que os 9 blocos do BMC se organizam na Matriz
// do Instrumento 2 (cada bloco aponta para uma destas chaves no seu campo "area").
const AREAS = {
  'interface-cliente': 'Interface com o Cliente',
  'produto-oferta': 'Produto/Oferta',
  'gestao-infraestrutura': 'Gestão de Infraestrutura',
  'aspetos-financeiros': 'Aspetos Financeiros'
};

/**
 * Os nove blocos do Business Model Canvas, na ordem canónica da tese.
 * Cada bloco tem sempre a mesma forma:
 *   id          — usado como chave em todo o resto do site (diagnóstico, seleção, fichas)
 *   nome        — nome do bloco em português (a versão EN vive em i18n.js, TRADUCOES_I1_EN.blocos)
 *   area        — uma das 4 chaves de AREAS, acima
 *   descricao   — explicação em linguagem simples, usada na grelha do Passo 2 do index
 *   ficha       — true só para os 4 blocos com Ficha de Decisão no Instrumento 3
 *   matriz      — { aplicacoes, oportunidades, riscos }, cada uma um array de 3 frases — a Matriz do Instrumento 2 (Tabela 10)
 *   indicadores — 3 perguntas de reflexão, mostradas no Instrumento 1 para ajudar a avaliar Prontidão/Impacto
 *
 * Não há comentários bloco a bloco a seguir — o conteúdo de cada campo é
 * só texto vindo do Apêndice de Instrumentos da tese, não lógica.
 */
const BMC_BLOCOS = [
  {
    id: 'segmentos-clientes',
    nome: 'Segmentos de Clientes',
    area: 'interface-cliente',
    descricao: 'Os grupos de clientes que a empresa serve. Diferentes segmentos podem ter necessidades distintas.',
    ficha: false,
    matriz: {
      aplicacoes: [
      'Segmentação semântica a partir de dados de CRM e interações',
      'Análise automática de perfis e comportamentos',
      'Síntese de feedback para caracterização de segmentos'
    ],
      oportunidades: [
      'Personalização da oferta por segmento sem esforço manual',
      'Identificação de novos segmentos a partir de dados existentes',
      'Apoio a decisões de targeting'
    ],
      riscos: [
      'Qualidade e estrutura dos dados de clientes',
      'Enviesamentos nos modelos reproduzidos na segmentação',
      'Privacidade e conformidade no uso de dados pessoais'
    ]
    },
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
    descricao: 'O que a empresa oferece para resolver um problema ou satisfazer uma necessidade do cliente.',
    ficha: false,
    matriz: {
      aplicacoes: [
      'Geração de conteúdos comerciais personalizados (propostas, descrições)',
      'Adaptação automática da mensagem de valor por segmento',
      'Apoio à criação e atualização de materiais de marketing'
    ],
      oportunidades: [
      'Diferenciação por personalização a custo reduzido',
      'Redução do tempo de produção de conteúdos',
      'Escala da comunicação sem crescimento da equipa criativa'
    ],
      riscos: [
      'Risco de alucinações em conteúdo factual ou técnico',
      'Inconsistência de tom e identidade de marca',
      'Dependência de validação humana para conteúdo publicável'
    ]
    },
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
    descricao: 'Como a empresa comunica e entrega valor aos clientes — site, redes sociais, loja, apoio ao cliente.',
    ficha: true,
    matriz: {
      aplicacoes: [
      'Chatbots e assistentes virtuais para atendimento multicanal',
      'Automação de comunicação',
      'Geração de respostas personalizadas em tempo real'
    ],
      oportunidades: [
      'Disponibilidade 24/7 sem aumento de equipa',
      'Redução do tempo de resposta ao cliente',
      'Comunicação adaptada ao perfil e idioma do utilizador'
    ],
      riscos: [
      'Falhas de qualidade expostas diretamente ao cliente',
      'Lock-in tecnológico',
      'Conformidade RGPD no tratamento de dados de interação'
    ]
    },
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
    descricao: 'O tipo de relação estabelecida com cada segmento — apoio, fidelização, acompanhamento pós-venda.',
    ficha: true,
    matriz: {
      aplicacoes: [
      'Atendimento automático personalizado e proativo',
      'Análise de sentimento em feedback e reclamações',
      'Suporte pós-venda assistido por IA'
    ],
      oportunidades: [
      'Escalabilidade do serviço sem crescimento linear de custos',
      'Melhoria da experiência e fidelização baseada em dados',
      'Identificação precoce de insatisfação'
    ],
      riscos: [
      'Risco de alucinações em respostas',
      'Perda de proximidade humana em contextos relacionais',
      'Necessidade de validação e supervisão contínua dos outputs'
    ]
    },
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
    descricao: 'Como a empresa gera rendimento a partir de cada segmento de clientes — vendas, subscrições, serviços.',
    ficha: false,
    matriz: {
      aplicacoes: [
      'Criação de novos serviços baseados em análise e geração de conteúdo com IA',
      'Personalização de oferta que suporta modelos premium ou de subscrição',
      'Melhoria de taxas de conversão por comunicação mais eficaz'
    ],
      oportunidades: [
      'Diversificação de fontes de receita com serviços digitais escaláveis',
      'Aumento de conversão comercial sem aumento proporcional de custos',
      'Criação de vantagem competitiva sustentável baseada em dados'
    ],
      riscos: [
      'Incerteza na medição do retorno do investimento em fases iniciais',
      'Dificuldade de monetizar benefícios indiretos de eficiência',
      'Risco de canibalização de serviços existentes por automação'
    ]
    },
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
    descricao: 'As tarefas mais importantes para o modelo de negócio funcionar — produção, operações, comunicação.',
    ficha: true,
    matriz: {
      aplicacoes: [
      'Geração automática de relatórios e síntese de documentos',
      'Sumarização e categorização de informação não estruturada',
      'Apoio ao desenvolvimento de software e documentação técnica'
    ],
      oportunidades: [
      'Redução de carga administrativa em tarefas intensivas em linguagem',
      'Aceleração de processos de gestão do conhecimento',
      'Apoio à tomada de decisão baseada em análise documental'
    ],
      riscos: [
      'Necessidade de validação humana dos outputs gerados',
      'Qualidade variável em domínios técnicos especializados',
      'Integração com sistemas e fluxos de trabalho existentes'
    ]
    },
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
    descricao: 'Os ativos mais importantes de que a empresa precisa — pessoas, equipamento, conhecimento, infraestrutura.',
    ficha: true,
    matriz: {
      aplicacoes: [
      'Integração de APIs LLM como recurso tecnológico central',
      'Construção de base de conhecimento organizacional assistida por IA',
      'Reforço do capital intelectual através de ferramentas de produtividade'
    ],
      oportunidades: [
      'Acesso a capacidades avançadas sem desenvolvimento interno',
      'Reforço do capital tecnológico com investimento inicial reduzido',
      'Democratização de ferramentas antes exclusivas de grandes empresas'
    ],
      riscos: [
      'Dependência de fornecedores externos e custos recorrentes de API',
      'Escassez de competências internas para operacionalizar soluções',
      'Risco de lock-in e dificuldade de migração entre fornecedores'
    ]
    },
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
    descricao: 'Os fornecedores e parceiros externos com quem a empresa trabalha para complementar recursos ou reduzir riscos.',
    ficha: false,
    matriz: {
      aplicacoes: [
      'Integração com fornecedores de plataformas LLM (APIs comerciais)',
      'Colaboração com consultoras de transformação digital e IA',
      'Acesso a ecossistemas de parceiros tecnológicos cloud'
    ],
      oportunidades: [
      'Acesso a tecnologia de ponta sem desenvolvimento próprio',
      'Redução do risco de implementação com apoio especializado',
      'Aceleração da curva de aprendizagem organizacional'
    ],
      riscos: [
      'Dependência crítica de parceiro tecnológico único',
      'Custos de mudança elevados em caso de descontinuação',
      'Alinhamento de interesses e condições contratuais de longo prazo'
    ]
    },
    indicadores: [
      'Trabalha com fornecedores tecnológicos ou consultores externos?',
      'Existem relações com plataformas cloud ou de software como serviço (SaaS)?',
      'Há abertura para estabelecer novos acordos com fornecedores de IA?'
    ]
  },
  {
    id: 'estrutura-custos',
    nome: 'Estrutura de Custos',
    area: 'aspetos-financeiros',
    descricao: 'Os principais custos envolvidos em operar o modelo de negócio.',
    ficha: false,
    matriz: {
      aplicacoes: [
      'Automação de tarefas manuais de custo operacional elevado',
      'Otimização de processos repetitivos com redução de erros',
      'Substituição parcial de outsourcing em tarefas de conteúdo e análise'
    ],
      oportunidades: [
      'Redução de custos operacionais através de automação escalável',
      'Libertação de recursos humanos para atividades de maior valor',
      'Eficiência crescente com volume sem aumento proporcional de custo'
    ],
      riscos: [
      'Custos recorrentes de subscrição e API imprevisíveis com volume',
      'Investimento inicial em formação e adaptação de processos',
      'Dificuldade de controlo orçamental em modelos de pricing por uso'
    ]
    },
    indicadores: [
      'Existem custos elevados associados a tarefas manuais ou repetitivas?',
      'Tem capacidade de absorver custos de subscrição recorrentes (SaaS)?',
      'Há mecanismos de controlo ou monitorização de custos operacionais?'
    ]
  }
];

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

// NOTA: definido mas ainda não usado em nenhuma página — fica pronto
// para o dia em que se queira mostrar, junto do selo de prioridade, uma
// frase a explicar o que cada classificação significa na prática.
const DESCRICAO_PRIORIDADE = {
  'Prioritário': 'Avançar para a Matriz LLM × BMC com prioridade.',
  'Relevante': 'Potencial identificado; avaliar na Matriz LLM × BMC.',
  'Investimento necessário': 'Alto impacto bloqueado por baixa prontidão; reforçar condições de base (infraestrutura, dados, competências) antes de avançar.',
  'Diferir': 'Prioridade baixa no contexto atual da PME.'
};

/** Cruza Prontidão × Impacto (1 a 3) e devolve a prioridade do bloco, segundo a Tabela 7. */
function classificarBloco(prontidao, impacto) {
  return MATRIZ_PRIORIDADE[prontidao][impacto];
}

/**
 * Classificação de PME segundo a Recomendação 2003/361/CE — usada tanto
 * no Passo 1 do index (para mostrar o selo em tempo real e bloquear
 * "Seguinte" se a empresa não for uma PME) como no resumo exportado em
 * resultados.js. Estava duplicada nos dois ficheiros; centralizou-se
 * aqui para não haver duas versões da mesma regra a divergir com o tempo.
 */
const ORDEM_TIERS = ['micro', 'pequena', 'media', 'grande'];

/** Classificação só pelo critério de colaboradores (um dos dois critérios da UE — o outro é o financeiro). */
function tierPorColaboradores(n) {
  if (n < 10) return 'micro';
  if (n < 50) return 'pequena';
  if (n < 250) return 'media';
  return 'grande';
}

/**
 * Classificação final, cruzando colaboradores e escalão financeiro
 * (volume de negócios OU balanço total). Usa-se o pior dos dois — uma
 * empresa só conta como "pequena", por exemplo, se AMBOS os critérios
 * apontarem para pequena ou menos.
 */
function classificacaoSME(colaboradores, escalao) {
  const tierStaff = tierPorColaboradores(colaboradores);
  return ORDEM_TIERS[Math.max(ORDEM_TIERS.indexOf(tierStaff), ORDEM_TIERS.indexOf(escalao))];
}

/**
 * Instrumento 3 — Fichas de Decisão. Só os 4 blocos com `ficha: true` em
 * BMC_BLOCOS têm entrada aqui (Recursos-Chave, Canais, Relacionamento com
 * Clientes, Atividades-Chave) — são os que têm densidade de evidência
 * suficiente na literatura para uma orientação operacional detalhada.
 *
 * Cada ficha tem sempre as mesmas seis secções (na mesma ordem em que
 * aparecem no Instrumento 3 e no resumo da página de resultados):
 *   contexto             — porque é que este bloco importa, em prosa
 *   aplicacoes           — lista de aplicações LLM prioritárias
 *   orientacaoTecnologica — array de {opcao, quando, consideracoes}: as opções técnicas e quando escolher cada uma
 *   acoes                — lista de passos concretos a executar
 *   criterios            — array de {criterio, indicador}: como medir se está a resultar
 *   governanca           — texto sobre RGPD/AI Act relevante para este bloco
 *
 * (`pendente: true` é um estado alternativo, ainda por usar — ver o
 * comentário de renderFichaPendente em instrumento3.js.)
 */
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
  'canais': {
    titulo: 'Canais',
    area: 'I - Interface com o Cliente',
    requisitos: 'RF1 · RF2 · RF3 · RF4',
    contexto: 'Os Canais definem como a PME comunica e entrega valor aos seus segmentos de clientes. Em PMEs, os canais digitais (email, website, redes sociais) coexistem frequentemente com canais presenciais, com baixo nível de automação e elevada dependência de intervenção humana. A adoção de LLM neste bloco visa automatizar e personalizar a comunicação, reduzindo o tempo de resposta e aumentando a capacidade de interação sem crescimento proporcional da equipa.',
    aplicacoes: [
      'Chatbots e assistentes virtuais para atendimento e qualificação de leads em website',
      'Automação de respostas a perguntas frequentes por email ou redes sociais',
      'Geração de conteúdos personalizados para campanhas multicanal',
      'Tradução e adaptação automática de comunicações para diferentes mercados'
    ],
    orientacaoTecnologica: [
      {
        opcao: 'API comercial (GPT, Claude, Gemini)',
        quando: 'Volume de interações moderado; sem dados sensíveis; necessidade de implementação rápida',
        consideracoes: 'Custo previsível a baixo volume; dependência de fornecedor; conformidade RGPD exige revisão contratual'
      },
      {
        opcao: 'Open-source (LLaMA, Mistral)',
        quando: 'Dados sensíveis que não podem sair da organização; maior controlo sobre o modelo',
        consideracoes: 'Requer infraestrutura própria ou cloud dedicada; maior investimento inicial em configuração'
      },
      {
        opcao: 'RAG',
        quando: 'Chatbot que responde com base em documentação interna (catálogos, FAQs, contratos)',
        consideracoes: 'Solução recomendada para PMEs com documentação estruturada; reduz alucinações; integrável com APIs comerciais'
      }
    ],
    acoes: [
      'Identificar os canais com maior volume de interações repetitivas (email, chat, formulários)',
      'Selecionar um canal piloto de baixo risco para implementação inicial',
      'Definir o âmbito de resposta automática e os limites de escalamento para humano',
      'Integrar o LLM com as plataformas de comunicação existentes via API',
      'Estabelecer processo de revisão periódica da qualidade das respostas geradas'
    ],
    criterios: [
      { criterio: 'Eficiência', indicador: 'Redução do tempo médio de resposta ao cliente' },
      { criterio: 'Qualidade', indicador: 'Taxa de resolução sem escalamento para humano' },
      { criterio: 'Satisfação', indicador: 'Avaliação da experiência pelo cliente (NPS ou equivalente)' },
      { criterio: 'Custo', indicador: 'Custo por interação antes e após implementação' }
    ],
    governanca: 'RGPD: os dados de interação com clientes (nome, email, histórico de conversa) são dados pessoais. Garantir base legal para tratamento, informar o utilizador da presença de sistema automatizado e assegurar mecanismo de opt-out. AI Act: sistemas de interação com utilizadores finais estão sujeitos a requisitos de transparência (o utilizador deve ser informado de que interage com um sistema de IA). Risco de reputação: falhas visíveis ao cliente têm impacto direto na imagem da PME. Definir limiar de confiança abaixo do qual a resposta é sempre revista por humano antes de envio.'
  },
  'relacionamento-clientes': {
    titulo: 'Relacionamento com Clientes',
    area: 'I - Interface com o Cliente',
    requisitos: 'RF1 · RF2 · RF3 · RF4',
    contexto: 'O Relacionamento com Clientes define o tipo de relação que a PME estabelece com cada segmento — desde o atendimento reativo até abordagens proativas de fidelização. Em PMEs, este bloco é frequentemente gerido de forma informal e intensiva em tempo humano, com baixa capacidade de escala. A adoção de LLM permite tornar o relacionamento mais responsivo, personalizado e orientado por dados, sem exigir crescimento proporcional da equipa.',
    aplicacoes: [
      'Atendimento automático 24/7 com respostas personalizadas e contextualmente adequadas',
      'Análise de sentimento em feedbacks, reclamações e avaliações de clientes',
      'Suporte pós-venda automatizado: seguimento, confirmações e resolução de dúvidas',
      'Geração de comunicações proativas personalizadas (follow-up, renovações, alertas)'
    ],
    orientacaoTecnologica: [
      {
        opcao: 'API comercial',
        quando: 'PME sem infraestrutura própria; necessidade de arranque rápido; volume de interações baixo a moderado',
        consideracoes: 'Opção de menor barreira de entrada; avaliar custos recorrentes face ao volume esperado'
      },
      {
        opcao: 'RAG sobre CRM',
        quando: 'PME com histórico de clientes estruturado em CRM ou base de dados interna',
        consideracoes: 'Permite respostas contextualizadas com o histórico do cliente; recomendado para PMEs com dados organizados'
      },
      {
        opcao: 'Fine-tuning',
        quando: 'Tom e linguagem muito específicos da marca; volume elevado de interações justifica investimento',
        consideracoes: 'Maior investimento inicial; requer dados de treino de qualidade; adequado em fases de maturidade avançada'
      }
    ],
    acoes: [
      'Mapear os pontos de contacto com o cliente onde o volume ou repetição é maior',
      'Definir o tom e os limites de autonomia do sistema (o que responde automaticamente versus escala)',
      'Integrar o LLM com o CRM existente para acesso ao histórico do cliente',
      'Implementar análise de sentimento em canais de feedback para deteção precoce de insatisfação',
      'Criar processo de revisão e melhoria contínua com base nos casos de escalamento'
    ],
    criterios: [
      { criterio: 'Responsividade', indicador: 'Tempo médio de primeira resposta ao cliente' },
      { criterio: 'Fidelização', indicador: 'Taxa de retenção de clientes antes e após implementação' },
      { criterio: 'Qualidade relacional', indicador: 'Pontuação de satisfação em interações assistidas por IA' },
      { criterio: 'Escalamento', indicador: 'Percentagem de casos resolvidos sem intervenção humana' }
    ],
    governanca: 'RGPD: o processamento de dados pessoais de clientes para personalização do relacionamento exige base legal explícita. O histórico de interações não deve ser partilhado com modelos externos sem anonimização ou acordo contratual adequado. AI Act: sistemas que tomam decisões com impacto no relacionamento com o cliente (e.g., classificação de risco de churn) podem requerer explicabilidade e supervisão humana.'
  },
  'atividades-chave': {
    titulo: 'Atividades-Chave',
    area: 'III - Gestão de Infraestrutura',
    requisitos: 'RF1 · RF2 · RF3 · RF4',
    contexto: 'As Atividades-Chave representam as ações mais importantes que a PME deve executar para que o seu modelo de negócio funcione. Em PMEs, estas atividades incluem frequentemente tarefas intensivas em linguagem, produção de relatórios, análise documental, comunicações internas e externas, e gestão do conhecimento, com elevado consumo de tempo e baixo grau de automação. A adoção de LLM neste bloco tem o potencial de libertar capacidade operacional significativa.',
    aplicacoes: [
      'Geração automática de relatórios operacionais e sumários executivos',
      'Extração, sumarização e categorização de informação em documentos não estruturados',
      'Apoio à redação de propostas comerciais, contratos e comunicações formais',
      'Assistência ao desenvolvimento de software e geração de documentação técnica',
      'Automatização de fluxos de aprovação e triagem documental'
    ],
    orientacaoTecnologica: [
      {
        opcao: 'API comercial',
        quando: 'Tarefas de geração de texto sem dados sensíveis; necessidade de flexibilidade e variedade de tarefas',
        consideracoes: 'Custo variável com volume de tokens; avaliar exposição de documentos internos ao fornecedor'
      },
      {
        opcao: 'RAG sobre documentação interna',
        quando: 'PME com repositório de documentos interno (manuais, processos, contratos, relatórios anteriores)',
        consideracoes: 'Solução recomendada para geração de relatórios contextualizados; reduz alucinações em domínios especializados'
      },
      {
        opcao: 'Open-source local',
        quando: 'Documentos confidenciais que não podem sair da organização (dados financeiros, jurídicos)',
        consideracoes: 'Maior controlo e privacidade; requer infraestrutura de suporte; adequado a PMEs com apoio técnico externo'
      }
    ],
    acoes: [
      'Identificar as atividades com maior volume de produção documental ou análise de texto',
      'Selecionar um processo piloto de baixa criticidade para primeira implementação',
      'Definir templates e prompts padronizados para os outputs mais frequentes',
      'Estabelecer fluxo de validação humana obrigatória antes de publicação ou envio',
      'Monitorizar tempo poupado e qualidade dos outputs para justificar escala'
    ],
    criterios: [
      { criterio: 'Eficiência', indicador: 'Tempo médio de produção documental antes e após implementação' },
      { criterio: 'Qualidade', indicador: 'Taxa de aprovação dos outputs sem revisão substantiva' },
      { criterio: 'Adoção interna', indicador: 'Percentagem de colaboradores que utilizam regularmente as ferramentas LLM' },
      { criterio: 'Poupança', indicador: 'Estimativa de horas libertadas por mês para atividades de maior valor' }
    ],
    governanca: 'RGPD: documentos internos que contenham dados pessoais (colaboradores, clientes, fornecedores) não devem ser submetidos a APIs externas sem avaliação do impacto de proteção de dados (DPIA). AI Act: sistemas de apoio a decisões internas com impacto em processos críticos devem assegurar rastreabilidade e possibilidade de auditoria dos outputs gerados.'
  }
};
