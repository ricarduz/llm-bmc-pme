/**
 * i18n.js — tudo o que é preciso para o site funcionar em PT e EN.
 *
 * Como usar num elemento HTML: marca-se com data-i18n="chave", e a
 * função aplicarTraducoes() (mais abaixo) substitui o texto lá dentro
 * pelo que estiver em TRADUCOES[idioma][chave].
 *
 * A preferência de idioma fica guardada em localStorage (chave
 * IDIOMA_KEY) — por isso é partilhada por todas as páginas do site: se
 * o utilizador muda para inglês no index, o Instrumento 1 já abre em
 * inglês também.
 *
 * Este ficheiro tem duas partes bem distintas:
 *   1. Os dicionários (TRADUCOES e TRADUCOES_I1_EN) — só dados.
 *   2. As funções (a partir de "t()", perto do fim) — a lógica que decide
 *      qual idioma mostrar e aplica as traduções à página.
 */

const IDIOMA_KEY = 'llm-bmc-pme:idioma';

const TRADUCOES = {
  pt: {
    'titulo-pagina': 'Framework de adoção de LLM em PME',
    'meta-descricao': 'Ferramenta interativa de demonstração do framework de adoção de Large Language Models por PME, estruturado no Business Model Canvas.',
    'eyebrow': 'Instrumento de demonstração · dissertação de Mestrado',
    'h1': 'Um percurso guiado para decidir onde os LLM fazem sentido na sua PME',
    'lead': 'Esta ferramenta instancia sequencialmente os três instrumentos do framework de apoio à adoção de Large Language Models (LLM) por Pequenas e Médias Empresas, estruturado no Business Model Canvas (BMC). Responda a estes passos iniciais.',
    'card1-titulo': '1. A minha empresa está pronta?',
    'card1-nota': 'Instrumento 1 — Diagnóstico de Pré-requisitos. Avalia, bloco a bloco, a prontidão operacional e a criticidade de cada área do seu negócio.',
    'card2-titulo': '2. Onde faz sentido para a minha PME?',
    'card2-nota': 'Instrumento 2 — Matriz LLM × BMC. Mapeia aplicações, oportunidades e riscos nos blocos identificados como prioritários.',
    'card3-titulo': '3. Como avanço neste bloco?',
    'card3-nota': 'Instrumento 3 — Fichas de Decisão. Orientação tecnológica e ações concretas para os blocos com maior densidade de evidência empírica.',
    'antes-titulo': 'Antes de começar',
    'antes-texto': 'As respostas ficam guardadas neste navegador enquanto usa este instrumento. No final, pode descarregar um resumo dos resultados; os dados do diagnóstico (sem identificação pessoal) serão usados para apoio à investigação. Não é recolhido nenhum dado pessoal identificativo, a não ser que opte por deixar o seu e-mail para receber os resultados do estudo (no máximo até 31 de agosto de 2027).',
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
    'i1-continuar': 'Continuar →',
    'i1-limpar': 'Limpar respostas',
    'i1-limpar-confirmar': 'Isto apaga todas as respostas do diagnóstico guardadas neste navegador. Continuar?',
    'seguinte': 'Seguinte →',
    'voltar': '← Voltar',
    'passo1-titulo': 'Passo 1 — Perfil da empresa',
    'passo1-lead': 'Estes dados servem apenas para caracterizar a sua PME e garantir a qualidade da análise — não são recolhidos dados pessoais.',
    'perfil-setor-label': 'Setor de atividade',
    'perfil-opcao-escolher': 'Escolha uma opção',
    'perfil-setor-comercio': 'Comércio',
    'perfil-setor-servicos': 'Serviços',
    'perfil-setor-industria': 'Indústria e Produção',
    'perfil-setor-construcao': 'Construção',
    'perfil-setor-tecnologia': 'Tecnologia e Informação',
    'perfil-setor-turismo': 'Turismo e Restauração',
    'perfil-setor-agricultura': 'Agricultura e Pescas',
    'perfil-setor-saude': 'Saúde e Ação Social',
    'perfil-setor-educacao': 'Educação',
    'perfil-setor-outro': 'Outro',
    'perfil-pais-label': 'País',
    'perfil-pais-pt': 'Portugal',
    'perfil-pais-europa': 'Outro país da Europa',
    'perfil-limpar': 'Limpar respostas',
    'perfil-limpar-confirmar': 'Isto apaga os dados do perfil da empresa preenchidos nesta sessão. Continuar?',
    'perfil-colaboradores-label': 'Número de colaboradores',
    'perfil-faturacao-label': 'Faturação anual — escolha o critério que preferir reportar (Recomendação 2003/361/CE)',
    'perfil-criterio-volume': 'Volume de negócios',
    'perfil-criterio-balanco': 'Balanço total',
    'perfil-escalao-micro': '≤ 2 milhões € (micro)',
    'perfil-escalao-pequena': '≤ 10 milhões € (pequena)',
    'perfil-escalao-media-volume': '≤ 50 milhões € (média)',
    'perfil-escalao-media-balanco': '≤ 43 milhões € (média)',
    'perfil-escalao-grande-volume': '> 50 milhões €',
    'perfil-escalao-grande-balanco': '> 43 milhões €',
    'classificacao-micro': 'Classificação estimada: micro empresa',
    'classificacao-pequena': 'Classificação estimada: pequena empresa',
    'classificacao-media': 'Classificação estimada: média empresa',
    'classificacao-grande': 'Classificação estimada: não é considerada uma PME',
    'classificacao-label': 'Classificação estimada',
    'classificacao-valor-micro': 'Micro empresa',
    'classificacao-valor-pequena': 'Pequena empresa',
    'classificacao-valor-media': 'Média empresa',
    'classificacao-valor-grande': 'Não é considerada uma PME',
    'aviso-nao-pme': 'Este estudo aplica-se apenas a Pequenas e Médias Empresas (PME). Não é possível avançar com os dados indicados.',
    'aba-descarregar': 'Descarregar',
    'aba-resultado': 'Resultados',
    'perfil-regiao-label': 'Região (NUTS II)',
    'perfil-regiao-norte': 'Norte',
    'perfil-regiao-centro': 'Centro',
    'perfil-regiao-lisboa': 'Área Metropolitana de Lisboa',
    'perfil-regiao-alentejo': 'Alentejo',
    'perfil-regiao-algarve': 'Algarve',
    'perfil-regiao-acores': 'Região Autónoma dos Açores',
    'perfil-regiao-madeira': 'Região Autónoma da Madeira',
    'passo2-titulo': 'Passo 2 — Os nove blocos do Business Model Canvas',
    'passo2-lead': 'O diagnóstico do Instrumento 1 vai perguntar-lhe sobre cada um destes blocos. Esta grelha explica o que cada um significa, para orientar as suas respostas.',
    'passo3-titulo': 'Passo 3 — Os três instrumentos',
    'sintese-eyebrow': 'Síntese',
    'sintese-h1': 'Resultados da sessão',
    'sintese-lead': 'Resumo do percurso completo. Pode descarregar este registo, ou terminar a sessão.',
    'sintese-tabela-titulo': 'Perfil de prioridade por bloco',
    'sintese-aprofundados-titulo': 'Blocos selecionados para aprofundamento',
    'sintese-nenhum-bloco': 'Nenhum bloco foi selecionado para aprofundamento na Matriz.',
    'sintese-todos-diferir': 'O diagnóstico classificou todos os blocos do seu negócio como "Diferir" — a sua empresa não cumpre atualmente os critérios de prioridade para a adoção de Large Language Models. Pode repetir o diagnóstico no futuro, à medida que o negócio evoluir.',
    'sintese-nenhum-avaliado': 'Nenhum bloco avaliado.',
    'sintese-com-ficha': ' — com Ficha de Decisão',
    'sintese-download-titulo': 'Descarregar o seu resumo',
    'sintese-download-nota': 'Um ficheiro simples, pronto a abrir em qualquer computador — sem necessidade de programas técnicos.',
    'sintese-download-botao': 'Descarregar resumo →',
    'contacto-titulo': 'Receber os resultados do estudo',
    'contacto-nota': 'Se quiser ser contactado(a) com as conclusões finais desta investigação, deixe o seu e-mail. É usado exclusivamente para esse fim e não é partilhado com terceiros. O envio poderá ocorrer até 31 de agosto de 2027 (data-limite para a defesa desta dissertação).',
    'contacto-email-label': 'E-mail',
    'contacto-consentimento': 'Aceito que o meu e-mail seja utilizado exclusivamente para me contactar com os resultados finais deste estudo.',
    'contacto-guardar-botao': 'Guardar contacto',
    'contacto-confirmacao': 'Obrigado — guardámos o seu contacto para lhe enviarmos os resultados finais deste estudo até 31 de agosto de 2027.',
    'contacto-email-invalido': 'Introduza um e-mail válido e aceite a condição acima.',
    'sessao-recomecar': 'Recomeçar',
    'sessao-recomecar-confirmar': 'Isto apaga todos os dados desta sessão guardados neste navegador. Continuar?',
    'sessao-terminar': 'Terminar sessão',
    'sessao-terminar-confirmar': 'Tem a certeza? Os resultados serão apagados deste navegador e não poderá recuperá-los depois. Se ainda não descarregou o resumo, faça-o antes de continuar.',
    'sessao-terminada-titulo': 'Sessão terminada',
    'sessao-terminada-agradecimento': 'Obrigado por participar neste estudo — a sua contribuição é uma ajuda preciosa para esta investigação.',
    'sessao-terminada-texto': 'Os dados desta sessão foram apagados deste navegador. Pode fechar esta janela.',
    'r-passo1-titulo': 'Passo 1 — A sua opinião',
    'r-passo2-titulo': 'Passo 2 — Resultado do diagnóstico',
    'satisfacao-titulo': 'Antes de ver o resultado',
    'satisfacao-percebeu': 'Percebeu claramente o resultado deste diagnóstico?',
    'satisfacao-util': 'Considera que este instrumento será útil para a sua empresa?',
    'sim': 'Sim',
    'nao': 'Não',
    'i2-eyebrow': 'Instrumento 2 de 3',
    'i2-h1': 'Matriz LLM × BMC',
    'i2-lead': 'Com base no diagnóstico, estes são os blocos com potencial identificado. Para cada um, a Matriz mapeia aplicações, oportunidades e riscos. Selecione os blocos que pretende aprofundar no Instrumento 3.',
    'i2-sem-blocos': 'Nenhum bloco foi classificado como Prioritário ou Relevante no diagnóstico. Pode rever o <a href="instrumento1.html">Instrumento 1</a> ou avançar diretamente para a síntese.',
    'i2-rever-diagnostico': '← Rever diagnóstico',
    'i2-continuar-fichas': 'Continuar para as Fichas de Decisão →',
    'i2-continuar-sintese': 'Continuar para a síntese →',
    'i2-limpar': 'Limpar seleção',
    'i2-limpar-confirmar': 'Isto limpa a seleção de blocos a aprofundar nesta sessão. Continuar?',
    'th-aplicacoes': 'Aplicações',
    'th-oportunidades': 'Oportunidades',
    'th-riscos': 'Riscos',
    'ficha-contexto': 'Contexto',
    'ficha-aplicacoes': 'Aplicações prioritárias',
    'ficha-tecnologia': 'Orientação tecnológica',
    'th-opcao': 'Opção',
    'th-adequada-quando': 'Adequada quando',
    'th-consideracoes': 'Considerações',
    'ficha-acoes': 'Ações concretas',
    'th-criterio': 'Critério',
    'th-indicador': 'Indicador de impacto',
    'ficha-governanca': 'Conformidade e governança',
    'ficha-criterios': 'Critérios de avaliação',
    'ficha-titulo-sufixo': 'Ficha de Decisão',
    'i2-aprofundar': 'Aprofundar este bloco na Ficha de Decisão',
    'i2-sem-ficha': 'Sem Ficha de Decisão disponível — a Matriz é o nível máximo de orientação para este bloco',
    'i1-resumo-titulo': 'Resultado global do diagnóstico',
    'i1-resumo-lead': 'Perfil de prioridade dos nove blocos do BMC, resultante das suas respostas.',
    'th-bloco': 'Bloco BMC',
    'th-prontidao': 'Prontidão',
    'th-impacto': 'Impacto',
    'th-prioridade': 'Prioridade',
    'sobre-titulo': 'Sobre este projeto',
    'sobre-autor-titulo': 'Sobre o autor',
    'sobre-autor-texto': 'Ricardo Isaías Serafim — profissional de Business Intelligence e gestão de informação numa multinacional, atualmente a concluir o Mestrado em Engenharia Informática e Tecnologia Web (UAb/UTAD). Este projeto cruza a experiência empresarial com a investigação académica em IA aplicada a PME.',
    'sobre-tese-titulo': 'Sobre a tese em curso',
    'sobre-tese-texto': 'Esta dissertação desenvolve um framework operacional que apoia gestores de PME a decidir, de forma estruturada, onde e como adotar Large Language Models (LLM) no seu negócio. Construído a partir de uma revisão sistemática da literatura e da metodologia Design Science Research, articula três instrumentos — um diagnóstico de pré-requisitos, uma matriz de aplicações por bloco do Business Model Canvas e fichas de decisão com orientação tecnológica — validados junto de um painel de especialistas. Esta ferramenta interativa é o artefacto central da investigação, desenvolvida para a obtenção do grau de Mestre em Engenharia Informática e Tecnologia Web pela Universidade Aberta, em parceria com a UTAD, sob orientação do Prof. Doutor Frederico Branco.',
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
    'lead': 'This tool sequentially instantiates the three instruments of the framework supporting the adoption of Large Language Models (LLMs) by Small and Medium-sized Enterprises (SMEs), structured around the Business Model Canvas (BMC). Answer these initial steps.',
    'card1-titulo': '1. Is my company ready?',
    'card1-nota': 'Instrument 1 — Prerequisite Diagnostic. Assesses, block by block, operational readiness and the criticality of each area of your business.',
    'card2-titulo': '2. Where does it make sense for my SME?',
    'card2-nota': 'Instrument 2 — LLM × BMC Matrix. Maps applications, opportunities and risks across the blocks identified as priorities.',
    'card3-titulo': '3. How do I move forward on this block?',
    'card3-nota': 'Instrument 3 — Decision Sheets. Technology guidance and concrete actions for the blocks with the strongest empirical evidence base.',
    'antes-titulo': 'Before you start',
    'antes-texto': 'Your answers are stored in this browser while you use this instrument. At the end, you can download a summary of the results; the diagnostic data (with no personal identification) will be used to support the research. No identifying personal data is collected, unless you choose to leave your email to receive the study results (by 31 August 2027 at the latest).',
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
    'i1-continuar': 'Continue →',
    'i1-limpar': 'Clear answers',
    'i1-limpar-confirmar': 'This clears all diagnostic answers saved in this browser. Continue?',
    'seguinte': 'Next →',
    'voltar': '← Back',
    'passo1-titulo': 'Step 1 — Company profile',
    'passo1-lead': 'This data is only used to characterise your SME and ensure the quality of the analysis — no personal data is collected.',
    'perfil-setor-label': 'Sector of activity',
    'perfil-opcao-escolher': 'Choose an option',
    'perfil-setor-comercio': 'Trade and Retail',
    'perfil-setor-servicos': 'Services',
    'perfil-setor-industria': 'Industry and Manufacturing',
    'perfil-setor-construcao': 'Construction',
    'perfil-setor-tecnologia': 'Technology and IT',
    'perfil-setor-turismo': 'Tourism and Hospitality',
    'perfil-setor-agricultura': 'Agriculture and Fisheries',
    'perfil-setor-saude': 'Health and Social Care',
    'perfil-setor-educacao': 'Education',
    'perfil-setor-outro': 'Other',
    'perfil-pais-label': 'Country',
    'perfil-pais-pt': 'Portugal',
    'perfil-pais-europa': 'Another European country',
    'perfil-limpar': 'Clear answers',
    'perfil-limpar-confirmar': 'This clears the company profile data filled in this session. Continue?',
    'perfil-colaboradores-label': 'Number of employees',
    'perfil-faturacao-label': 'Annual turnover — choose which criterion you prefer to report (Recommendation 2003/361/EC)',
    'perfil-criterio-volume': 'Turnover',
    'perfil-criterio-balanco': 'Balance sheet total',
    'perfil-escalao-micro': '≤ €2 million (micro)',
    'perfil-escalao-pequena': '≤ €10 million (small)',
    'perfil-escalao-media-volume': '≤ €50 million (medium)',
    'perfil-escalao-media-balanco': '≤ €43 million (medium)',
    'perfil-escalao-grande-volume': '> €50 million',
    'perfil-escalao-grande-balanco': '> €43 million',
    'classificacao-micro': 'Estimated classification: micro enterprise',
    'classificacao-pequena': 'Estimated classification: small enterprise',
    'classificacao-media': 'Estimated classification: medium enterprise',
    'classificacao-grande': 'Estimated classification: not considered an SME',
    'classificacao-label': 'Estimated classification',
    'classificacao-valor-micro': 'Micro enterprise',
    'classificacao-valor-pequena': 'Small enterprise',
    'classificacao-valor-media': 'Medium enterprise',
    'classificacao-valor-grande': 'Not considered an SME',
    'aviso-nao-pme': 'This study applies only to Small and Medium-sized Enterprises (SMEs). It is not possible to proceed with the details provided.',
    'aba-descarregar': 'Download',
    'aba-resultado': 'Results',
    'perfil-regiao-label': 'Region (NUTS II)',
    'perfil-regiao-norte': 'North',
    'perfil-regiao-centro': 'Centre',
    'perfil-regiao-lisboa': 'Lisbon Metropolitan Area',
    'perfil-regiao-alentejo': 'Alentejo',
    'perfil-regiao-algarve': 'Algarve',
    'perfil-regiao-acores': 'Azores Autonomous Region',
    'perfil-regiao-madeira': 'Madeira Autonomous Region',
    'passo2-titulo': 'Step 2 — The nine Business Model Canvas blocks',
    'passo2-lead': 'The Instrument 1 diagnostic will ask you about each of these blocks. This grid explains what each one means, to guide your answers.',
    'passo3-titulo': 'Step 3 — The three instruments',
    'sintese-eyebrow': 'Summary',
    'sintese-h1': 'Session results',
    'sintese-lead': 'Summary of the full journey. You can download this record, or end the session.',
    'sintese-tabela-titulo': 'Priority profile by block',
    'sintese-aprofundados-titulo': 'Blocks selected for further exploration',
    'sintese-nenhum-bloco': 'No block was selected for further exploration in the Matrix.',
    'sintese-todos-diferir': 'The diagnostic classified every block of your business as "Defer" — your company does not currently meet the priority criteria for adopting Large Language Models. You can repeat the diagnostic in the future, as the business evolves.',
    'sintese-nenhum-avaliado': 'No block assessed.',
    'sintese-com-ficha': ' — with Decision Sheet',
    'sintese-download-titulo': 'Download your summary',
    'sintese-download-nota': 'A simple file, ready to open on any computer — no technical software required.',
    'sintese-download-botao': 'Download summary →',
    'contacto-titulo': 'Receive the study results',
    'contacto-nota': 'If you would like to be contacted with the final conclusions of this research, leave your email. It is used exclusively for that purpose and is not shared with third parties. It will be sent by 31 August 2027 (the deadline for the defence of this dissertation).',
    'contacto-email-label': 'E-mail',
    'contacto-consentimento': 'I agree that my email will be used exclusively to contact me with the final results of this study.',
    'contacto-guardar-botao': 'Save contact',
    'contacto-confirmacao': 'Thank you — we saved your contact to send you the final results of this study by 31 August 2027.',
    'contacto-email-invalido': 'Enter a valid email and accept the condition above.',
    'sessao-recomecar': 'Restart',
    'sessao-recomecar-confirmar': 'This clears all session data saved in this browser. Continue?',
    'sessao-terminar': 'End session',
    'sessao-terminar-confirmar': 'Are you sure? The results will be deleted from this browser and cannot be recovered afterwards. If you have not downloaded the summary yet, do so before continuing.',
    'sessao-terminada-titulo': 'Session ended',
    'sessao-terminada-agradecimento': 'Thank you for taking part in this study — your contribution is a valuable help to this research.',
    'sessao-terminada-texto': 'This session\'s data has been deleted from this browser. You may close this window.',
    'r-passo1-titulo': 'Step 1 — Your opinion',
    'r-passo2-titulo': 'Step 2 — Diagnostic result',
    'satisfacao-titulo': 'Before you see the result',
    'satisfacao-percebeu': 'Did you clearly understand the result of this diagnostic?',
    'satisfacao-util': 'Do you think this tool will be useful for your company?',
    'sim': 'Yes',
    'nao': 'No',
    'i2-eyebrow': 'Instrument 2 of 3',
    'i2-h1': 'LLM × BMC Matrix',
    'i2-lead': 'Based on the diagnostic, these are the blocks with identified potential. For each one, the Matrix maps applications, opportunities and risks. Select the blocks you want to explore further in Instrument 3.',
    'i2-sem-blocos': 'No block was classified as Priority or Relevant in the diagnostic. You can review <a href="instrumento1.html">Instrument 1</a> or go straight to the summary.',
    'i2-rever-diagnostico': '← Review diagnostic',
    'i2-continuar-fichas': 'Continue to the Decision Sheets →',
    'i2-continuar-sintese': 'Continue to the summary →',
    'i2-limpar': 'Clear selection',
    'i2-limpar-confirmar': 'This clears the selection of blocks to explore further in this session. Continue?',
    'th-aplicacoes': 'Applications',
    'th-oportunidades': 'Opportunities',
    'th-riscos': 'Risks',
    'ficha-contexto': 'Context',
    'ficha-aplicacoes': 'Priority applications',
    'ficha-tecnologia': 'Technology guidance',
    'th-opcao': 'Option',
    'th-adequada-quando': 'Suitable when',
    'th-consideracoes': 'Considerations',
    'ficha-acoes': 'Concrete actions',
    'th-criterio': 'Criterion',
    'th-indicador': 'Impact indicator',
    'ficha-governanca': 'Compliance and governance',
    'ficha-criterios': 'Evaluation criteria',
    'ficha-titulo-sufixo': 'Decision Sheet',
    'i2-aprofundar': 'Explore this block further in the Decision Sheet',
    'i2-sem-ficha': 'No Decision Sheet available — the Matrix is the highest level of guidance for this block',
    'i1-resumo-titulo': 'Overall diagnostic result',
    'i1-resumo-lead': 'Priority profile for the nine BMC blocks, based on your answers.',
    'th-bloco': 'BMC Block',
    'th-prontidao': 'Readiness',
    'th-impacto': 'Impact',
    'th-prioridade': 'Priority',
    'sobre-titulo': 'About this project',
    'sobre-autor-titulo': 'About the author',
    'sobre-autor-texto': 'Ricardo Isaías Serafim — a Business Intelligence and information management professional at a multinational company, currently completing an MSc in Computer Engineering and Web Technology (UAb/UTAD). This project bridges corporate experience with academic research on AI in SMEs.',
    'sobre-tese-titulo': 'About the ongoing dissertation',
    'sobre-tese-texto': 'This dissertation develops an operational framework that helps SME managers decide, in a structured way, where and how to adopt Large Language Models (LLMs) in their business. Built from a systematic literature review and the Design Science Research methodology, it brings together three instruments — a prerequisite diagnostic, an application matrix by Business Model Canvas block, and decision sheets with technology guidance — validated with a panel of experts. This interactive tool is the central artefact of the research, developed for the degree of Master in Computer Engineering and Web Technology at Universidade Aberta, in partnership with UTAD, supervised by Prof. Dr. Frederico Branco.',
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
      matriz: {
        aplicacoes: [
        "Semantic segmentation from CRM data and interactions",
        "Automatic analysis of profiles and behaviours",
        "Feedback synthesis for segment characterisation"
      ],
        oportunidades: [
        "Segment-based personalisation of the offer without manual effort",
        "Identification of new segments from existing data",
        "Support for targeting decisions"
      ],
        riscos: [
        "Quality and structure of customer data",
        "Biases in models reproduced in segmentation",
        "Privacy and compliance in the use of personal data"
      ]
      },
            descricao: "The customer groups the company serves. Different segments may have distinct needs.",
      indicadores: [
        'Is there structured customer data (e.g., CRM)?',
        'Do you segment or differentiate customers by profile or need?',
        'Can you record and analyse customer interactions?'
      ]
    },
    'proposta-valor': {
      nome: 'Value Proposition',
      matriz: {
        aplicacoes: [
        "Generation of personalised commercial content (proposals, descriptions)",
        "Automatic adaptation of the value message by segment",
        "Support for creating and updating marketing materials"
      ],
        oportunidades: [
        "Differentiation through personalisation at reduced cost",
        "Reduced content production time",
        "Scaling communication without growing the creative team"
      ],
        riscos: [
        "Risk of hallucinations in factual or technical content",
        "Inconsistency in tone and brand identity",
        "Dependence on human validation for publishable content"
      ]
      },
            descricao: "What the company offers to solve a problem or satisfy a customer need.",
      indicadores: [
        'Does the value proposition include personalisation or differentiated service?',
        'Is there regular production of commercial content?',
        'Is there a frequent need to adapt the offer to the customer?'
      ]
    },
    'canais': {
      nome: 'Channels',
      matriz: {
        aplicacoes: [
        "Chatbots and virtual assistants for multichannel support",
        "Communication automation",
        "Real-time generation of personalised responses"
      ],
        oportunidades: [
        "24/7 availability without increasing headcount",
        "Reduced customer response time",
        "Communication adapted to the user's profile and language"
      ],
        riscos: [
        "Quality failures exposed directly to the customer",
        "Technological lock-in",
        "GDPR compliance in handling interaction data"
      ]
      },
            descricao: "How the company communicates and delivers value to customers — website, social media, store, customer support.",
      indicadores: [
        'Do you use digital channels to communicate with customers (email, social media)?',
        'Are there service or communication platforms already in place?',
        'Are there frequently asked questions on those channels?'
      ]
    },
    'relacionamento-clientes': {
      nome: 'Customer Relationships',
      matriz: {
        aplicacoes: [
        "Personalised and proactive automated support",
        "Sentiment analysis in feedback and complaints",
        "AI-assisted after-sales support"
      ],
        oportunidades: [
        "Service scalability without linear cost growth",
        "Improved data-driven experience and loyalty",
        "Early identification of dissatisfaction"
      ],
        riscos: [
        "Risk of hallucinations in responses",
        "Loss of human closeness in relational contexts",
        "Need for continuous validation and supervision of outputs"
      ]
      },
            descricao: "The type of relationship established with each segment — support, loyalty, after-sales follow-up.",
      indicadores: [
        'Is there a customer support service with a regular volume of interactions?',
        'Are there defined after-sales follow-up or loyalty processes?',
        'Are complaints or comments recorded in a structured way?'
      ]
    },
    'fontes-receita': {
      nome: 'Revenue Streams',
      matriz: {
        aplicacoes: [
        "Creation of new services based on AI analysis and content generation",
        "Offer personalisation supporting premium or subscription models",
        "Improved conversion rates through more effective communication"
      ],
        oportunidades: [
        "Revenue diversification through scalable digital services",
        "Increased commercial conversion without proportional cost increase",
        "Building sustainable, data-based competitive advantage"
      ],
        riscos: [
        "Uncertainty in measuring return on investment in early stages",
        "Difficulty monetising indirect efficiency benefits",
        "Risk of cannibalising existing services through automation"
      ]
      },
            descricao: "How the company generates income from each customer segment — sales, subscriptions, services.",
      indicadores: [
        'Are there digital services with potential to scale?',
        'Can you introduce new data-based service models?',
        'Are there sales or conversion processes that could be improved by personalised communication?'
      ]
    },
    'atividades-chave': {
      nome: 'Key Activities',
      matriz: {
        aplicacoes: [
        "Automatic generation of reports and document summaries",
        "Summarisation and categorisation of unstructured information",
        "Support for software development and technical documentation"
      ],
        oportunidades: [
        "Reduced administrative burden in language-intensive tasks",
        "Faster knowledge management processes",
        "Support for decision-making based on document analysis"
      ],
        riscos: [
        "Need for human validation of generated outputs",
        "Variable quality in specialised technical domains",
        "Integration with existing systems and workflows"
      ]
      },
            descricao: "The most important tasks for the business model to work — production, operations, communication.",
      indicadores: [
        'Are there language-intensive activities (reports, communications)?',
        'Are there repetitive administrative tasks with a high volume of documents?',
        'Are operational processes at least minimally documented?'
      ]
    },
    'recursos-chave': {
      nome: 'Key Resources',
      matriz: {
        aplicacoes: [
        "Integration of LLM APIs as a core technological resource",
        "Building an AI-assisted organisational knowledge base",
        "Strengthening intellectual capital through productivity tools"
      ],
        oportunidades: [
        "Access to advanced capabilities without in-house development",
        "Strengthening technological capital with reduced initial investment",
        "Democratising tools previously exclusive to large companies"
      ],
        riscos: [
        "Dependence on external suppliers and recurring API costs",
        "Shortage of internal skills to operationalise solutions",
        "Risk of lock-in and difficulty migrating between providers"
      ]
      },
            descricao: "The most important assets the company needs — people, equipment, knowledge, infrastructure.",
      indicadores: [
        'Do you have basic digital infrastructure (computers, internet access)?',
        'Does at least one employee have the digital literacy to operate an LLM?',
        'Is there organised internal documentation or a knowledge base (manuals, FAQs, processes, contracts)?'
      ]
    },
    'parcerias-chave': {
      nome: 'Key Partnerships',
      matriz: {
        aplicacoes: [
        "Integration with LLM platform providers (commercial APIs)",
        "Collaboration with digital transformation and AI consultancies",
        "Access to cloud technology partner ecosystems"
      ],
        oportunidades: [
        "Access to cutting-edge technology without in-house development",
        "Reduced implementation risk with specialised support",
        "Faster organisational learning curve"
      ],
        riscos: [
        "Critical dependence on a single technology partner",
        "High switching costs in case of discontinuation",
        "Aligning interests and long-term contractual conditions"
      ]
      },
            descricao: "The external suppliers and partners the company works with to complement resources or reduce risk.",
      indicadores: [
        'Do you work with technology suppliers or external consultants?',
        'Are there relationships with cloud or Software-as-a-Service (SaaS) platforms?',
        'Is there openness to establishing new agreements with AI suppliers?'
      ]
    },
    'estrutura-custos': {
      nome: 'Cost Structure',
      matriz: {
        aplicacoes: [
        "Automation of manual tasks with high operating cost",
        "Optimisation of repetitive processes with fewer errors",
        "Partial replacement of outsourcing in content and analysis tasks"
      ],
        oportunidades: [
        "Reduced operating costs through scalable automation",
        "Freeing up human resources for higher-value activities",
        "Growing efficiency with volume without proportional cost increase"
      ],
        riscos: [
        "Unpredictable recurring subscription and API costs with volume",
        "Initial investment in training and process adaptation",
        "Difficulty controlling budgets under usage-based pricing models"
      ]
      },
            descricao: "The main costs involved in operating the business model.",
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

/**
 * A partir daqui: funções auxiliares. As duas constantes acima (TRADUCOES
 * e TRADUCOES_I1_EN) são só dados; é aqui que se decide QUAL idioma usar
 * e COMO aplicar as traduções à página.
 */

/** Atalho para ir buscar uma string simples ao dicionário, no idioma atual. Se a chave não existir, devolve a própria chave (mais fácil de detetar um erro de nome do que ver "undefined" no ecrã). */
function t(chave) {
  const dicionario = TRADUCOES[obterIdioma()] || TRADUCOES.pt;
  return dicionario[chave] || chave;
}

/** Nome de uma área do BMC (as 4 agregações de blocos) no idioma atual. */
function tArea(id) {
  if (obterIdioma() === 'en') return TRADUCOES_I1_EN.areas[id] || AREAS[id];
  return AREAS[id];
}

/**
 * Devolve o conteúdo de um bloco do BMC (nome, indicadores, descrição,
 * matriz) já no idioma certo. O português vem sempre diretamente de
 * data.js — não há uma cópia "TRADUCOES_PT" redundante — e o inglês, só
 * quando existe tradução para aquele bloco em concreto. Isto permite
 * adicionar/editar conteúdo em data.js sem ter de duplicar nada aqui,
 * desde que a tradução EN exista (ou fica só em português, sem rebentar).
 */
function tBloco(bloco) {
  if (obterIdioma() === 'en' && TRADUCOES_I1_EN.blocos[bloco.id]) {
    return { descricao: bloco.descricao, matriz: bloco.matriz, ...TRADUCOES_I1_EN.blocos[bloco.id] };
  }
  return { nome: bloco.nome, indicadores: bloco.indicadores, descricao: bloco.descricao, matriz: bloco.matriz };
}

/** Texto da escala de Prontidão ou Impacto (1/2/3) no idioma atual. `eixo` é 'prontidao' ou 'impacto'. */
function tEscala(eixo, valor) {
  if (obterIdioma() === 'en') return TRADUCOES_I1_EN[eixo][valor];
  return (eixo === 'prontidao' ? PRONTIDAO_DEF : IMPACTO_DEF)[valor];
}

/**
 * Traduz o nome de uma prioridade (Prioritário, Relevante, Diferir,
 * Investimento necessário). Importante: isto é só para o TEXTO mostrado
 * ao utilizador — o valor "canónico" guardado no estado e usado nos
 * seletores CSS (data-p="Prioritário") mantém-se sempre em português,
 * mesmo com a página em inglês. Ou seja, tPrioridade() nunca deve ser
 * usado para comparar valores, só para os mostrar.
 */
function tPrioridade(p) {
  if (obterIdioma() === 'en') return TRADUCOES_I1_EN.prioridade[p] || p;
  return p;
}

/** Idioma atual ('pt' ou 'en'), guardado em localStorage — por isso é o mesmo em todas as páginas do site. Por defeito, português. */
function obterIdioma() {
  return localStorage.getItem(IDIOMA_KEY) || 'pt';
}

function definirIdioma(idioma) {
  localStorage.setItem(IDIOMA_KEY, idioma);
}

/**
 * O "motor" da tradução: corre sempre que a página carrega, e outra vez
 * sempre que o utilizador troca de idioma no seletor PT/EN. Faz três
 * coisas:
 *   1. Atualiza o atributo lang do <html> (bom para acessibilidade/SEO).
 *   2. Substitui o texto de todos os elementos marcados com data-i18n.
 *   3. Marca visualmente qual botão do seletor (PT ou EN) está ativo.
 *
 * O que NÃO faz: não atualiza conteúdo gerado dinamicamente por JavaScript
 * (como os blocos do Instrumento 1 ou a tabela de resultados) — esse
 * conteúdo tem o seu próprio listener para o evento "idioma:alterado"
 * (disparado no fundo deste ficheiro) e volta a chamar a sua função de
 * render() própria.
 */
function aplicarTraducoes() {
  const idioma = obterIdioma();
  const dicionario = TRADUCOES[idioma] || TRADUCOES.pt;

  document.documentElement.lang = idioma === 'pt' ? 'pt-PT' : 'en';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const chave = el.getAttribute('data-i18n');
    if (dicionario[chave]) el.innerHTML = dicionario[chave];
  });

  // A meta description não tem data-i18n (não faria sentido, não é visível
  // na página), por isso trata-se à parte aqui.
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
      // Avisa o resto da página (o script específico de cada instrumento)
      // de que o idioma mudou, para poder voltar a desenhar o conteúdo
      // dinâmico com o texto certo. Ver, por exemplo, o final de
      // instrumento1.js: document.addEventListener('idioma:alterado', render).
      document.dispatchEvent(new CustomEvent('idioma:alterado'));
    });
  });
});
