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
    'titulo-pagina': 'LLM em PME — Framework de adoção de LLM em PME',
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
    'i1-lead': 'Avalie cada bloco do BMC nos eixos <strong>Prontidão</strong> e <strong>Impacto</strong>, numa escala de 1 a 3, tendo a sua PME como referência.<br><br>Na Prontidão: 1 = condições ausentes; 2 = condições parciais ou informais; 3 = condições presentes e estruturadas.<br>No Impacto: 1 = bloco estável; 2 = bloco relevante, com margem de melhoria; 3 = bloco crítico, com problemas visíveis ou grande potencial de ganho.',
    'i1-indicadores-intro': 'Considere, entre outros aspetos:',
    'i1-proposito': 'O Instrumento 1 — Diagnóstico de Pré-requisitos — identifica, para cada bloco do Business Model Canvas, se a sua PME já tem as condições e a urgência necessárias para avançar com LLM.',
    'i1-eixo-prontidao': 'Prontidão — em que medida a PME dispõe destas condições?',
    'i1-eixo-impacto': 'Impacto — quão crítico é este bloco para o desempenho atual?',
    'i1-por-avaliar': 'por avaliar',
    'i1-com-ficha': ' · com Ficha de Decisão',
    'i1-progresso': ' de 9 blocos avaliados',
    'i1-continuar': 'Continuar para o Instrumento 2 →',
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
    'sintese-eyebrow': 'Avaliação',
    'sintese-h1': 'A sua avaliação',
    'crit-utilidade': 'Utilidade percebida — este framework ajuda uma PME a decidir onde adotar LLM de forma estruturada.',
    'crit-aplicabilidade': 'Aplicabilidade — as fichas e a matriz são realistas e aplicáveis ao contexto de uma PME.',
    'crit-consistencia': 'Consistência com a literatura — o conteúdo reflete de forma fiel a revisão de literatura subjacente.',
    'crit-completude': 'Completude — o framework cobre adequadamente os aspetos relevantes da adoção de LLM numa PME.',
    'sintese-secao-avaliacao': 'Avaliação',
    'sintese-secao-resultados': 'Resultados',
    'sintese-reflexao-titulo': 'Reflexão livre',
    'sintese-reflexao-texto': 'Espaço aberto para qualquer observação adicional da entrevista — pontos fortes, limitações, sugestões de melhoria. Mínimo de 75 palavras.',
    'sintese-bloqueio-texto': 'Complete os {n} critérios de avaliação e escreva pelo menos {min} palavras na reflexão livre para desbloquear esta secção.',
    'sintese-email-titulo': 'Receber os resultados finais do estudo',
    'sintese-email-texto': 'Se quiser ser contactado(a) com as conclusões finais desta investigação, deixe o seu email. É usado exclusivamente para esse fim. O envio poderá ocorrer até 31 de agosto de 2027 (data-limite para a defesa desta dissertação).',
    'sintese-email-label': 'Email (opcional)',
    'sintese-download-texto': 'Um ficheiro com a sua avaliação, pronto a abrir em qualquer computador. Depois de descarregar, as respostas ficam fixas e deixam de poder ser editadas.',
    'sintese-lead': 'Chegámos ao momento de avaliação. A sua opinião como especialista é uma peça central da validação desta dissertação — ajuda a perceber se o framework que desenvolvi é útil, aplicável e consistente com a literatura que o fundamenta. Responda com honestidade a cada critério; não há respostas certas ou erradas.',
    'sintese-canvas-titulo': 'Panorama do seu modelo de negócio',
    'sintese-canvas-lead': 'Os blocos a azul foram escolhidos para aprofundamento nas Fichas de Decisão; os restantes não foram considerados nesta fase.',
    'sintese-tabela-titulo': 'Perfil de prioridade por bloco',
    'sintese-aprofundados-titulo': 'Blocos selecionados para aprofundamento',
    'sintese-nenhum-bloco': 'Nenhum bloco foi selecionado para aprofundamento na Matriz.',
    'sintese-todos-diferir': 'O diagnóstico classificou todos os blocos do seu negócio como "Diferir" — a sua empresa não cumpre atualmente os critérios de prioridade para a adoção de Large Language Models. Pode repetir o diagnóstico no futuro, à medida que o negócio evoluir.',
    'sintese-nenhum-avaliado': 'Nenhum bloco avaliado.',
    'sintese-com-ficha': ' — com Ficha de Decisão',
    'sintese-download-titulo': 'Descarregar a sua avaliação',
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
    'sessao-terminar-confirmar': 'Ao concluir, os seus dados são enviados e depois apagados deste navegador — não será possível recuperá-los. Se ainda não descarregou os resultados, faça-o antes de continuar.',
    'modal-concluir-titulo': 'Concluir a sessão?',
    'modal-cancelar': 'Cancelar',
    'modal-sim': 'Sim',
    'pme-concluir-confirmar': 'Ao concluir, os seus dados são apagados deste navegador — não será possível recuperá-los. Se ainda não descarregou o relatório, faça-o antes de continuar.',
    'sessao-terminada-titulo': 'Sessão concluída',
    'sessao-terminada-agradecimento': 'Obrigado por participar neste estudo — a sua contribuição é uma ajuda preciosa para esta investigação.',
    'sessao-terminada-texto': 'Os dados desta sessão foram apagados deste navegador. Pode fechar esta janela.',
    'r-passo1-titulo': 'Passo 1 — A sua opinião',
    'r-passo2-titulo': 'Passo 2 — Resultado do diagnóstico',
    'satisfacao-titulo': 'Antes de ver o resultado',
    'satisfacao-percebeu': 'Percebeu claramente o resultado deste diagnóstico?',
    'satisfacao-util': 'Considera que este instrumento será útil para a sua empresa?',
    'sim': 'Sim',
    'nao': 'Não',
    'pme-satisfacao-percebeu': 'Percebeu claramente o resultado deste diagnóstico?',
    'pme-satisfacao-util': 'Considera que este instrumento será útil para o seu negócio?',
    'pme-consentimento': 'As suas respostas ficam guardadas neste navegador enquanto usa a ferramenta. Autorizo que os dados do diagnóstico (sem identificação pessoal) sejam também enviados para um repositório de apoio a esta investigação académica.',
    'pme-satisfacao-fixa': 'O relatório foi descarregado e estas respostas ficaram registadas — já não podem ser editadas.',
    'pme-email-consentimento': 'Aceito que o meu email seja utilizado exclusivamente para me contactar com os resultados finais deste estudo.',
    'pme-email-nao': 'Agora não, só descarregar',
    'pme-email-sim': 'Guardar e descarregar',
    'i2-eyebrow': 'Instrumento 2 de 3',
    'i2-h1': 'Matriz LLM × BMC',
    'i2-proposito': 'O Instrumento 2 — Matriz LLM × BMC — cruza os blocos com maior potencial com aplicações concretas de LLM, oportunidades e riscos associados.',
    'i2-lead': 'Com base no diagnóstico, estes são os blocos com potencial identificado. Para cada um, a Matriz mapeia aplicações, oportunidades e riscos. Selecione os blocos que pretende aprofundar no Instrumento 3.',
    'i2-sem-blocos': 'Nenhum bloco foi classificado como Prioritário ou Relevante no diagnóstico. Pode rever o <a href="instrumento1.html">Instrumento 1</a> ou avançar diretamente para a síntese.',
    'i2-rever-diagnostico': '← Rever diagnóstico',
    'i3-eyebrow': 'Instrumento 3 de 3',
    'i3-h1': 'Fichas de Decisão',
    'i3-proposito': 'O Instrumento 3 — Fichas de Decisão — traduz os blocos selecionados na Matriz em orientação prática: que tecnologia escolher, que ações tomar, e como avaliar o resultado.',
    'i3-lead': 'Cada bloco selecionado tem a sua própria Ficha, organizada em seis secções fixas — contexto, aplicações, orientação tecnológica, ações, critérios de avaliação e governança. Se houver mais do que uma, use as abas acima para navegar entre elas.',
    'i2-rever-diagnostico-i3': '← Rever seleção',
    'i3-ver-sintese': 'Ver síntese →',
    'i3-traducao-indicativa': 'Esta tradução ainda não foi revista nem certificada — serve apenas de indicação; a versão de referência é sempre a portuguesa.',
    'i3-nenhuma-ficha': 'Nenhum bloco com Ficha de Decisão foi selecionado no Instrumento 2. Pode <a href="instrumento2.html">rever a seleção</a> ou avançar para a síntese.',
    'i2-continuar-fichas': 'Continuar para o Instrumento 3 →',
    'i2-continuar-sintese': 'Continuar para o resultado →',
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
    'sobre-autor-texto': 'Sou Ricardo Isaías Serafim, economista, licenciado em Gestão de Informação pela Universidade Nova de Lisboa. Trabalho para o Grupo Schwarz, no Lidl Portugal, e estou atualmente destacado no Lidl Chéquia. Sou responsável por Planeamento Financeiro, Reporting e Data Science, e lidero também a Transformação Digital na área de Controlo de Gestão. Este projeto cruza a minha experiência empresarial com a investigação académica em IA aplicada a PME — o mesmo tema que me entusiasmou a abraçar esta aventura académica. Caso tenha dúvidas, contacte-me através de <a href="mailto:m2302605@estudante.uab.pt">m2302605@estudante.uab.pt</a>.',
    'entrevista-eyebrow': 'Painel de avaliação · dissertação de Mestrado',
    'entrevista-h1': 'Antes de começarmos',
    'entrevista-lead': 'Obrigado por aceitar participar nesta sessão de avaliação. Deixo-lhe aqui, em vídeo e por escrito, uma breve apresentação do que vamos fazer juntos.',
    'entrevista-video-placeholder': 'Espaço reservado para vídeo de apresentação',
    'entrevista-fazer-titulo': 'O que vamos fazer',
    'entrevista-fazer-texto-1': 'Olá, sou o Ricardo, estudante de Mestrado, e proponho esta entrevista semiestruturada, no âmbito da validação do framework desenvolvido na minha dissertação em Engenharia Informática e Tecnologia Web. Esta sessão tem a duração aproximada de 60 minutos, estruturada em três momentos: uma apresentação do artefacto (~15 min), em que percorremos juntos os três instrumentos do framework — o Diagnóstico de Pré-requisitos, a Matriz LLM × BMC e as Fichas de Decisão — sem aplicação a um caso concreto (com a hipótese de utilizar exemplos pré-definidos); uma entrevista semiestruturada (~35 min), organizada pelos critérios de avaliação, pela ordem utilidade percebida, aplicabilidade, consistência com a literatura e completude; e um momento de reflexão livre (~10 min), para observações não cobertas pelo guião.',
    'entrevista-fazer-texto-2': 'Não há respostas certas ou erradas — o que procuro é uma apreciação fundamentada com base na sua experiência profissional. Pode interromper a qualquer momento para colocar questões.',
    'entrevista-perfil-titulo': 'Qual o seu perfil?',
    'entrevista-perfil-nota': 'Esta informação ajuda a organizar as respostas por perfil de especialista, tal como previsto no protocolo de avaliação da dissertação.',
    'entrevista-perfil-gestor': 'Gestor / Proprietário de PME',
    'entrevista-perfil-ti': 'Profissional de TI / Transformação Digital',
    'entrevista-perfil-academico': 'Investigador / Académico',
    'entrevista-autorizacao': 'Autorizo a participação nesta sessão de avaliação e o registo das minhas respostas para fins de investigação académica, no âmbito desta dissertação de Mestrado.',
    'entrevista-continuar': 'Continuar →',
    'cenario-titulo-pagina': 'Escolher um cenário · LLM em PME',
    'cenario-eyebrow': 'Antes do Instrumento 1',
    'cenario-h1': 'Como quer percorrer os instrumentos?',
    'cenario-lead': 'Pode preencher o diagnóstico com as suas próprias respostas, ou partir de um cenário de PME já preenchido — em qualquer dos casos, todas as respostas continuam editáveis nos instrumentos seguintes.',
    'cenario-autonomo-tag': 'Percurso livre',
    'cenario-autonomo-titulo': 'Continuar de forma autónoma',
    'cenario-autonomo-texto': 'Percorra os instrumentos e preencha o diagnóstico com as suas próprias respostas, sem partir de nenhum exemplo.',
    'cenario-autonomo-cta': 'Continuar →',
    'cenario-a-tag': 'Cenário exemplo',
    'cenario-usar-cta': 'Usar este cenário →',
    'cenario-colaboradores-label': 'Colaboradores',
    'cenario-faturacao-label': 'Faturação anual',
    'cenario-regiao-label': 'Região (NUTS II)',
    'cenario-nota-rodape': 'Estes três cenários são exemplos fictícios — servem apenas para explorar os instrumentos com dados já preenchidos, sem ter de responder de forma aleatória só para ver como o framework reage.',
    'index-sobre-titulo': 'Sobre esta ferramenta',
    'index-sobre-texto': 'Esta ferramenta é o resultado prático de uma dissertação de Mestrado em Engenharia Informática e Tecnologia Web (Universidade Aberta e UTAD), que estudou como as PME portuguesas podem adotar Inteligência Artificial de forma estruturada, sem exigir conhecimento técnico prévio. As perguntas e recomendações que vai encontrar baseiam-se numa revisão científica da literatura e foram validadas junto de um painel de especialistas em transformação digital.',
    'sobre-tese-titulo': 'Sobre a tese em curso',
    'sobre-tese-texto': 'Esta dissertação desenvolve um framework operacional que apoia gestores de PME a decidir, de forma estruturada, onde e como adotar Large Language Models (LLM) no seu negócio. Construído a partir de uma revisão sistemática da literatura e da metodologia Design Science Research, articula três instrumentos — um diagnóstico de pré-requisitos, uma matriz de aplicações por bloco do Business Model Canvas e fichas de decisão com orientação tecnológica — validados junto de um painel de especialistas. Esta ferramenta interativa é o artefacto central da investigação, desenvolvida para a obtenção do grau de Mestre em Engenharia Informática e Tecnologia Web pela Universidade Aberta, em parceria com a UTAD, sob orientação do Prof. Doutor Frederico Branco.',
    'modal-fechar': 'Fechar',
    'exp-i1-titulo': 'Instrumento 1 — Diagnóstico de Pré-requisitos',
    'exp-i1-texto': 'Constitui o ponto de entrada obrigatório do framework. Avalia, bloco a bloco do Business Model Canvas, a prontidão operacional da PME e a criticidade desse bloco para o desempenho atual do negócio. O cruzamento dos dois eixos — Prontidão e Impacto — gera uma matriz de decisão 3×3 que classifica cada bloco em quatro níveis: Prioritário, Relevante, Investimento necessário ou Diferir. O resultado alimenta diretamente o Instrumento 2. Operacionaliza os requisitos funcionais RF1, RF3 e RF4.',
    'exp-i2-titulo': 'Instrumento 2 — Matriz LLM × BMC',
    'exp-i2-texto': 'Mapeia panoramicamente as aplicações, oportunidades e riscos da adoção de LLM nos nove blocos do BMC, organizados em quatro áreas agregadas (Interface com o Cliente, Produto/Oferta, Gestão de Infraestrutura e Aspetos Financeiros). A partir dos blocos sinalizados no diagnóstico, identifica onde a adoção gera mais valor e seleciona os blocos a aprofundar. Operacionaliza o requisito funcional RF2.',
    'exp-i3-titulo': 'Instrumento 3 — Fichas de Decisão por Bloco BMC',
    'exp-i3-texto': 'O instrumento operacional mais aprofundado do framework, ativado de forma condicional para os blocos classificados como Prioritário ou Relevante que disponham de ficha completa: Canais, Relacionamento com Clientes, Atividades-Chave e Recursos-Chave. Cada ficha organiza-se em seis secções — contexto do bloco, aplicações LLM prioritárias, orientação tecnológica, ações concretas, critérios de avaliação, e conformidade e governança. Operacionaliza os requisitos funcionais RF1, RF2, RF3 e RF4.',

    'pme-titulo-pagina': 'Onde a IA pode ajudar o seu negócio · LLM em PME',
    'index-h1': 'Descubra onde a IA pode ajudar o seu negócio',
    'index-lead': 'Uma análise estruturada de 9 áreas do seu negócio, para identificar onde a implementação de AI [Large Language Models (LLM)] faz mais sentido, e como avançar. Esta ferramenta é o resultado prático de uma dissertação de Mestrado em Engenharia Informática e Tecnologia Web (Universidade Aberta e UTAD): as perguntas e recomendações que vai encontrar baseiam-se numa revisão científica da literatura.',
    'escolha-pme-tag': 'Para gestores de PME',
    'escolha-pme-titulo': 'Analisar o meu negócio',
    'escolha-pme-texto': 'Responda a um conjunto de perguntas simples sobre o seu negócio e receba, no final, um relatório personalizado — cerca de 10 minutos.',
    'escolha-pme-cta': 'Começar →',
    'escolha-especialista-tag': 'Painel de avaliação académica',
    'escolha-especialista-titulo': 'Sou especialista do painel',
    'escolha-especialista-texto': 'Percorra os três instrumentos do framework tal como descritos na dissertação, e registe a sua avaliação no final.',
    'escolha-especialista-cta': 'Continuar →',
    'pme-eyebrow': 'Instrumento de demonstração · dissertação de Mestrado',
    'pme-h1': 'Descubra onde a IA pode ajudar o seu negócio',
    'pme-lead': 'Vamos analisar o seu negócio em 9 áreas e identificar onde os Large Language Models (LLM) podem criar mais valor. No final, terá acesso a um relatório personalizado com essa análise.',
    'pme-tempo': '⏱ 10 minutos',
    'pme-areas': '9 áreas do negócio',
    'pme-sem-julgamento': 'Não há respostas certas ou erradas — isto serve para refletir sobre o seu negócio, não para o avaliar ou julgar.',
    'pme-comecar': 'Começar →',
    'pme-perfil-eyebrow': 'Sobre o seu negócio',
    'pme-setor-pergunta': 'Qual o setor de atividade da sua empresa?',
    'pme-colaboradores-pergunta': 'Quantos colaboradores tem a empresa?',
    'pme-continuar': 'Continuar →',
    'pme-faturacao-pergunta': 'Qual a faturação anual aproximada?',
    'pme-localizacao-pergunta': 'Onde está localizada a empresa?',
    'pme-regiao-placeholder': 'Escolha a região (NUTS II)',
    'pme-pais-placeholder': 'Escolha o país',
    'pme-ver-diagnostico': 'Iniciar diagnóstico →',
    'pme-pergunta-contador': 'Pergunta {n} de {total}',
    'pme-bloqueio-titulo': 'Este estudo é dedicado a Pequenas e Médias Empresas',
    'pme-bloqueio-texto': 'Pela dimensão indicada, a sua empresa está acima dos limiares de PME definidos pela Recomendação 2003/361/CE da União Europeia — este framework foi desenhado especificamente para PME, por isso não se aplica ao seu caso.',
    'pme-voltar-inicio': '← Voltar ao início',
    'pme-processando': 'A cruzar as suas respostas com as aplicações de IA mapeadas para PME…',
    'pme-relatorio-eyebrow': 'O seu relatório',
    'pme-relatorio-h1': 'Onde a IA pode ajudar o seu negócio',
    'pme-relatorio-lead': 'As áreas a azul são onde identificámos o maior potencial imediato para adotar Large Language Models (LLM) — a tecnologia por trás de assistentes como o ChatGPT — no seu negócio.',
    'pme-oportunidades-titulo': 'As suas oportunidades',
    'pme-perfil-setor-label': 'Setor',
    'pme-perfil-colaboradores-label': 'Colaboradores',
    'pme-perfil-faturacao-label': 'Faturação anual',
    'pme-sem-oportunidades': 'Com base nas suas respostas, nenhuma área do seu negócio reúne, neste momento, as condições e a urgência para avançar já com IA — o que é uma informação igualmente válida. Pode repetir esta análise no futuro, à medida que o negócio evoluir.',
    'pme-oportunidade-tag': 'Oportunidade',
    'pme-porque-sentido': 'Porque faz sentido',
    'pme-o-que-experimentar': 'O que pode experimentar',
    'pme-primeiros-passos': 'Primeiros passos',
    'pme-pontos-atencao': 'Pontos de atenção',
    'pme-descarregar': 'Descarregar relatório completo',
    'pme-concluir': 'Concluir'
  },
  en: {
    'titulo-pagina': 'LLM in SMEs — Framework for LLM Adoption in SMEs',
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
    'i1-lead': 'Assess each BMC block on the <strong>Readiness</strong> and <strong>Impact</strong> axes, on a scale from 1 to 3, using your SME as the reference.<br><br>For Readiness: 1 = conditions absent; 2 = conditions partial or informal; 3 = conditions present and structured.<br>For Impact: 1 = stable block; 2 = relevant block, with room for improvement; 3 = critical block, with visible issues or significant potential gain.',
    'i1-indicadores-intro': 'Consider, among other aspects:',
    'i1-proposito': 'Instrument 1 — Prerequisites Diagnostic — identifies, for each Business Model Canvas block, whether your SME already has the conditions and urgency needed to move forward with LLMs.',
    'i1-eixo-prontidao': 'Readiness — to what extent does the SME have these conditions in place?',
    'i1-eixo-impacto': 'Impact — how critical is this block to current performance?',
    'i1-por-avaliar': 'not yet assessed',
    'i1-com-ficha': ' · has a Decision Sheet',
    'i1-progresso': ' of 9 blocks assessed',
    'i1-continuar': 'Continue to Instrument 2 →',
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
    'sintese-eyebrow': 'Evaluation',
    'sintese-h1': 'Your evaluation',
    'crit-utilidade': 'Perceived usefulness — this framework helps an SME decide where to adopt LLMs in a structured way.',
    'crit-aplicabilidade': 'Applicability — the decision sheets and matrix are realistic and applicable to an SME\'s context.',
    'crit-consistencia': 'Consistency with the literature — the content faithfully reflects the underlying literature review.',
    'crit-completude': 'Completeness — the framework adequately covers the aspects relevant to LLM adoption in an SME.',
    'sintese-secao-avaliacao': 'Evaluation',
    'sintese-secao-resultados': 'Results',
    'sintese-reflexao-titulo': 'Free reflection',
    'sintese-reflexao-texto': 'Open space for any additional observations from the interview — strengths, limitations, suggestions for improvement. Minimum of 75 words.',
    'sintese-bloqueio-texto': 'Complete the {n} evaluation criteria and write at least {min} words in the free reflection to unlock this section.',
    'sintese-email-titulo': 'Receive the study\'s final results',
    'sintese-email-texto': 'If you\'d like to be contacted with the final conclusions of this research, leave your email. It is used exclusively for that purpose. It may be sent until 31 August 2027 (deadline for this dissertation\'s defence).',
    'sintese-email-label': 'Email (optional)',
    'sintese-download-texto': 'A file with your evaluation, ready to open on any computer. Once downloaded, your answers become fixed and can no longer be edited.',
    'sintese-lead': 'This is the evaluation stage. Your opinion as a specialist is a central part of validating this dissertation — it helps establish whether the framework I developed is useful, applicable, and consistent with the literature it is grounded in. Please answer each criterion honestly; there are no right or wrong answers.',
    'sintese-canvas-titulo': 'Overview of your business model',
    'sintese-canvas-lead': 'Blocks in blue were chosen for further exploration in the Decision Sheets; the rest were not considered at this stage.',
    'sintese-tabela-titulo': 'Priority profile by block',
    'sintese-aprofundados-titulo': 'Blocks selected for further exploration',
    'sintese-nenhum-bloco': 'No block was selected for further exploration in the Matrix.',
    'sintese-todos-diferir': 'The diagnostic classified every block of your business as "Defer" — your company does not currently meet the priority criteria for adopting Large Language Models. You can repeat the diagnostic in the future, as the business evolves.',
    'sintese-nenhum-avaliado': 'No block assessed.',
    'sintese-com-ficha': ' — with Decision Sheet',
    'sintese-download-titulo': 'Download your evaluation',
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
    'sessao-terminar-confirmar': 'When you finish, your data is submitted and then deleted from this browser — it cannot be recovered afterwards. If you haven\'t downloaded your results yet, do so before continuing.',
    'modal-concluir-titulo': 'Finish the session?',
    'modal-cancelar': 'Cancel',
    'modal-sim': 'Yes',
    'pme-concluir-confirmar': 'When you finish, your data is deleted from this browser — it cannot be recovered afterwards. If you haven\'t downloaded the report yet, do so before continuing.',
    'sessao-terminada-titulo': 'Session completed',
    'sessao-terminada-agradecimento': 'Thank you for taking part in this study — your contribution is a valuable help to this research.',
    'sessao-terminada-texto': 'This session\'s data has been deleted from this browser. You may close this window.',
    'r-passo1-titulo': 'Step 1 — Your opinion',
    'r-passo2-titulo': 'Step 2 — Diagnostic result',
    'satisfacao-titulo': 'Before you see the result',
    'satisfacao-percebeu': 'Did you clearly understand the result of this diagnostic?',
    'satisfacao-util': 'Do you think this tool will be useful for your company?',
    'sim': 'Yes',
    'nao': 'No',
    'pme-satisfacao-percebeu': 'Did you clearly understand this diagnostic\'s result?',
    'pme-satisfacao-util': 'Do you consider this tool will be useful for your business?',
    'pme-consentimento': 'Your answers are saved in this browser while you use the tool. I authorise the diagnostic data (with no personal identification) to also be sent to a repository supporting this academic research.',
    'pme-satisfacao-fixa': 'The report has been downloaded and these answers are now recorded — they can no longer be edited.',
    'pme-email-consentimento': 'I accept that my email will be used exclusively to contact me with the final results of this study.',
    'pme-email-nao': 'Not now, just download',
    'pme-email-sim': 'Save and download',
    'i2-eyebrow': 'Instrument 2 of 3',
    'i2-h1': 'LLM × BMC Matrix',
    'i2-proposito': 'Instrument 2 — LLM × BMC Matrix — cross-references the blocks with the greatest potential against concrete LLM applications, opportunities and associated risks.',
    'i2-lead': 'Based on the diagnostic, these are the blocks with identified potential. For each one, the Matrix maps applications, opportunities and risks. Select the blocks you want to explore further in Instrument 3.',
    'i2-sem-blocos': 'No block was classified as Priority or Relevant in the diagnostic. You can review <a href="instrumento1.html">Instrument 1</a> or go straight to the summary.',
    'i2-rever-diagnostico': '← Review diagnostic',
    'i3-eyebrow': 'Instrument 3 of 3',
    'i3-h1': 'Decision Sheets',
    'i3-proposito': 'Instrument 3 — Decision Sheets — translates the blocks selected in the Matrix into practical guidance: which technology to choose, what actions to take, and how to evaluate the outcome.',
    'i3-lead': 'Each selected block has its own Sheet, organised into six fixed sections — context, applications, technological guidance, actions, evaluation criteria and governance. If there\'s more than one, use the tabs above to navigate between them.',
    'i2-rever-diagnostico-i3': '← Review selection',
    'i3-ver-sintese': 'View summary →',
    'i3-traducao-indicativa': 'This translation has not been reviewed or certified — it is provided for guidance only; the Portuguese original remains the reference version.',
    'i3-nenhuma-ficha': 'No block with a Decision Sheet was selected in Instrument 2. You can <a href="instrumento2.html">review your selection</a> or move on to the summary.',
    'i2-continuar-fichas': 'Continue to Instrument 3 →',
    'i2-continuar-sintese': 'Continue to the result →',
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
    'sobre-autor-texto': 'I\'m Ricardo Isaías Serafim, an economist with a degree in Information Management from Universidade Nova de Lisboa. I work for the Schwarz Group at Lidl Portugal, currently on assignment with Lidl Czechia. I\'m responsible for Financial Planning, Reporting and Data Science, and I also lead Digital Transformation within Management Control. This project brings together my professional experience with academic research into AI applied to SMEs — the very topic that got me excited to take on this academic adventure. If you have any questions, feel free to reach me at <a href="mailto:m2302605@estudante.uab.pt">m2302605@estudante.uab.pt</a>.',
    'entrevista-eyebrow': 'Evaluation panel · Master\'s dissertation',
    'entrevista-h1': 'Before we begin',
    'entrevista-lead': 'Thank you for agreeing to take part in this evaluation session. Here, in video and in writing, is a brief introduction to what we\'ll be doing together.',
    'entrevista-video-placeholder': 'Reserved space for introduction video',
    'entrevista-fazer-titulo': 'What we\'ll be doing',
    'entrevista-fazer-texto-1': 'Hello, I\'m Ricardo, a Master\'s student, and I\'m proposing this semi-structured interview, as part of validating the framework developed in my dissertation in Computer Engineering and Web Technology. This session lasts approximately 60 minutes, structured in three moments: a presentation of the artefact (~15 min), where we go through the framework\'s three instruments together — the Prerequisites Diagnostic, the LLM × BMC Matrix, and the Decision Sheets — without applying them to a specific case (with the option of using predefined examples); a semi-structured interview (~35 min), organised around the evaluation criteria, in the order perceived usefulness, applicability, consistency with the literature, and completeness; and a free reflection moment (~10 min), for observations not covered by the script.',
    'entrevista-fazer-texto-2': 'There are no right or wrong answers — what I\'m looking for is an informed assessment based on your professional experience. You can interrupt at any time to ask questions.',
    'entrevista-perfil-titulo': 'What is your profile?',
    'entrevista-perfil-nota': 'This information helps organise responses by specialist profile, as set out in the dissertation\'s evaluation protocol.',
    'entrevista-perfil-gestor': 'SME Manager / Owner',
    'entrevista-perfil-ti': 'IT / Digital Transformation Professional',
    'entrevista-perfil-academico': 'Researcher / Academic',
    'entrevista-autorizacao': 'I authorise my participation in this evaluation session and the recording of my responses for academic research purposes, as part of this Master\'s dissertation.',
    'entrevista-continuar': 'Continue →',
    'cenario-titulo-pagina': 'Choose a scenario · LLM in SMEs',
    'cenario-eyebrow': 'Before Instrument 1',
    'cenario-h1': 'How would you like to go through the instruments?',
    'cenario-lead': 'You can fill in the diagnostic with your own answers, or start from an already-filled SME scenario — either way, every answer stays editable in the instruments that follow.',
    'cenario-autonomo-tag': 'Free path',
    'cenario-autonomo-titulo': 'Continue on your own',
    'cenario-autonomo-texto': 'Go through the instruments and fill in the diagnostic with your own answers, without starting from any example.',
    'cenario-autonomo-cta': 'Continue →',
    'cenario-a-tag': 'Example scenario',
    'cenario-usar-cta': 'Use this scenario →',
    'cenario-colaboradores-label': 'Employees',
    'cenario-faturacao-label': 'Annual turnover',
    'cenario-regiao-label': 'Region (NUTS II)',
    'cenario-nota-rodape': 'These three scenarios are fictional examples — they are only meant to help you explore the instruments with data already filled in, without having to answer at random just to see how the framework responds.',
    'index-sobre-titulo': 'About this tool',
    'index-sobre-texto': 'This tool is the practical outcome of a Master\'s dissertation in Computer Engineering and Web Technology (Universidade Aberta and UTAD), which studied how Portuguese SMEs can adopt Artificial Intelligence in a structured way, with no prior technical knowledge required. The questions and recommendations you\'ll find are grounded in a systematic literature review and were validated with a panel of digital transformation experts.',
    'sobre-tese-titulo': 'About the ongoing dissertation',
    'sobre-tese-texto': 'This dissertation develops an operational framework that helps SME managers decide, in a structured way, where and how to adopt Large Language Models (LLMs) in their business. Built from a systematic literature review and the Design Science Research methodology, it brings together three instruments — a prerequisite diagnostic, an application matrix by Business Model Canvas block, and decision sheets with technology guidance — validated with a panel of experts. This interactive tool is the central artefact of the research, developed for the degree of Master in Computer Engineering and Web Technology at Universidade Aberta, in partnership with UTAD, supervised by Prof. Dr. Frederico Branco.',
    'modal-fechar': 'Close',
    'exp-i1-titulo': 'Instrument 1 — Prerequisite Diagnostic',
    'exp-i1-texto': 'The mandatory entry point of the framework. Assesses, block by block of the Business Model Canvas, the SME\'s operational readiness and how critical that block is to current business performance. Crossing the two axes — Readiness and Impact — produces a 3×3 decision matrix that classifies each block into four levels: Priority, Relevant, Investment needed, or Defer. The result feeds directly into Instrument 2. Operationalises functional requirements RF1, RF3 and RF4.',
    'exp-i2-titulo': 'Instrument 2 — LLM × BMC Matrix',
    'exp-i2-texto': 'Provides a panoramic map of the applications, opportunities and risks of LLM adoption across the nine BMC blocks, organised into four aggregated areas (Customer Interface, Product/Offering, Infrastructure Management, and Financial Aspects). Based on the blocks flagged in the diagnostic, it identifies where adoption generates the most value and selects the blocks to explore further. Operationalises functional requirement RF2.',
    'exp-i3-titulo': 'Instrument 3 — Decision Sheets by BMC Block',
    'exp-i3-texto': 'The framework\'s most in-depth operational instrument, activated conditionally for blocks classified as Priority or Relevant that have a complete sheet available: Channels, Customer Relationships, Key Activities, and Key Resources. Each sheet is organised into six sections — block context, priority LLM applications, technology guidance, concrete actions, evaluation criteria, and compliance and governance. Operationalises functional requirements RF1, RF2, RF3 and RF4.',

    'pme-titulo-pagina': 'Where AI can help your business · LLM in SMEs',
    'index-h1': 'Discover where AI can help your business',
    'index-lead': 'A structured analysis of 9 areas of your business, to identify where the implementation of AI [Large Language Models (LLMs)] makes the most sense, and how to move forward. This tool is the practical outcome of a Master\'s dissertation in Computer Engineering and Web Technology (Universidade Aberta and UTAD): the questions and recommendations you\'ll find are grounded in a systematic literature review.',
    'escolha-pme-tag': 'For SME managers',
    'escolha-pme-titulo': 'Analyse my business',
    'escolha-pme-texto': 'Answer a set of simple questions about your business and get a personalised report at the end — about 10 minutes.',
    'escolha-pme-cta': 'Start →',
    'escolha-especialista-tag': 'Academic evaluation panel',
    'escolha-especialista-titulo': 'I\'m a panel expert',
    'escolha-especialista-texto': 'Go through the framework\'s three instruments as described in the dissertation, and record your evaluation at the end.',
    'escolha-especialista-cta': 'Continue →',
    'pme-eyebrow': 'Demonstration instrument · Master\'s dissertation',
    'pme-h1': 'Discover where AI can help your business',
    'pme-lead': 'We\'ll analyse your business across 9 areas and identify where Large Language Models (LLMs) can create the most value. At the end, you\'ll get a personalised report with that analysis.',
    'pme-tempo': '⏱ 10 minutes',
    'pme-areas': '9 business areas',
    'pme-sem-julgamento': 'There are no right or wrong answers — this is meant to help you reflect on your business, not to assess or judge it.',
    'pme-comecar': 'Start →',
    'pme-perfil-eyebrow': 'About your business',
    'pme-setor-pergunta': 'What is your company\'s sector of activity?',
    'pme-colaboradores-pergunta': 'How many employees does the company have?',
    'pme-continuar': 'Continue →',
    'pme-faturacao-pergunta': 'What is the approximate annual turnover?',
    'pme-localizacao-pergunta': 'Where is the company located?',
    'pme-regiao-placeholder': 'Choose the region (NUTS II)',
    'pme-pais-placeholder': 'Choose the country',
    'pme-ver-diagnostico': 'Start diagnostic →',
    'pme-pergunta-contador': 'Question {n} of {total}',
    'pme-bloqueio-titulo': 'This study is dedicated to Small and Medium-sized Enterprises',
    'pme-bloqueio-texto': 'Based on the size indicated, your company is above the SME thresholds defined by EU Recommendation 2003/361/EC — this framework was designed specifically for SMEs, so it does not apply to your case.',
    'pme-voltar-inicio': '← Back to start',
    'pme-processando': 'Cross-checking your answers with AI applications mapped for SMEs…',
    'pme-relatorio-eyebrow': 'Your report',
    'pme-relatorio-h1': 'Where AI can help your business',
    'pme-relatorio-lead': 'The areas in blue are where we identified the greatest immediate potential for adopting Large Language Models (LLMs) — the technology behind assistants like ChatGPT — in your business.',
    'pme-oportunidades-titulo': 'Your opportunities',
    'pme-perfil-setor-label': 'Sector',
    'pme-perfil-colaboradores-label': 'Employees',
    'pme-perfil-faturacao-label': 'Annual turnover',
    'pme-sem-oportunidades': 'Based on your answers, no area of your business currently has the conditions and urgency to move forward with AI right now — which is equally valid information. You can repeat this analysis in the future, as the business evolves.',
    'pme-oportunidade-tag': 'Opportunity',
    'pme-porque-sentido': 'Why it makes sense',
    'pme-o-que-experimentar': 'What you could try',
    'pme-primeiros-passos': 'First steps',
    'pme-pontos-atencao': 'Points of attention',
    'pme-descarregar': 'Download full report',
    'pme-concluir': 'Finish'
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
  },
  /**
   * Tradução de trabalho das 4 Fichas de Decisão (Instrumento 3) — feita
   * diretamente a partir do texto em data.js, sem revisão formal ainda.
   * Por isso, sempre que se mostra este conteúdo com o site em inglês,
   * aparece também um aviso a dizer que é uma tradução indicativa, não
   * certificada (ver 'i3-traducao-indicativa', mais acima nos dois
   * dicionários, e avisoTraducaoIndicativa() em instrumento3.js).
   */
  fichas: {
    'recursos-chave': {
      titulo: 'Key Resources',
      area: 'III - Infrastructure Management',
      requisitos: 'RF1 · RF2 · RF3 · RF4',
      contexto: 'Key Resources describe the most important assets an SME needs for its business model to work. Adopting LLMs brings in new technological and intellectual resources — APIs, cloud infrastructure, prompt engineering skills and organisational knowledge bases — that reshape the organisation\'s resource profile. This block is both a prerequisite and an outcome of adoption: an SME needs a minimum set of resources to adopt LLMs, and by adopting them, builds new resources in turn.',
      aplicacoes: [
        'Integrating LLM APIs as a core technological resource within operational processes',
        'Building a structured, searchable organisational knowledge base with AI',
        'Developing in-house skills in prompt writing and output supervision',
        'Creating a repository of reusable prompts and templates by function or process'
      ],
      orientacaoTecnologica: [
        { opcao: 'Commercial API as a base resource', quando: 'SMEs without in-house development capacity; speed of implementation is the priority', consideracoes: 'Lower upfront cost; external dependency; assess the provider\'s continuity and terms of service' },
        { opcao: 'RAG as a knowledge resource', quando: 'SMEs with valuable organisational knowledge scattered across documents', consideracoes: 'Turns existing documentation into a searchable resource; moderate investment; high return for knowledge-intensive SMEs' },
        { opcao: 'In-house infrastructure', quando: 'SMEs with high privacy requirements, or volume that justifies the investment', consideracoes: 'Greater control and independence; requires technical skills or an external support partner' }
      ],
      acoes: [
        'Audit existing technological resources against the minimum requirements for LLM adoption',
        'Select and contract the API provider or LLM platform best suited to the SME\'s profile',
        'Identify and train the employee responsible for managing and overseeing the LLM tools',
        'Build an initial repository of validated prompts for the priority tasks identified',
        'Define an internal policy on the use and autonomy limits of the LLM tools'
      ],
      criterios: [
        { criterio: 'Availability', indicador: 'Uptime and reliability of the LLM service integrated into processes' },
        { criterio: 'Internal competence', indicador: 'Number of employees able to use the tools autonomously' },
        { criterio: 'Cost-effectiveness', indicador: 'Monthly subscription/API cost against value generated (hours saved, outputs produced)' },
        { criterio: 'Independence', indicador: 'Degree of lock-in: how easily the organisation could switch providers if needed' }
      ],
      governanca: 'GDPR: contracts with API providers should include data sub-processing clauses where applicable. Check where data is processed and stored geographically.'
    },
    'canais': {
      titulo: 'Channels',
      area: 'I - Customer Interface',
      requisitos: 'RF1 · RF2 · RF3 · RF4',
      contexto: 'Channels define how the SME communicates and delivers value to its customer segments. In SMEs, digital channels (email, website, social media) often coexist with in-person channels, with low automation and heavy reliance on human intervention. Adopting LLMs in this block aims to automate and personalise communication, reducing response times and increasing the capacity to engage without a proportional increase in headcount.',
      aplicacoes: [
        'Chatbots and virtual assistants for website customer service and lead qualification',
        'Automated responses to frequently asked questions by email or social media',
        'Generating personalised content for multichannel campaigns',
        'Automatic translation and adaptation of communications for different markets'
      ],
      orientacaoTecnologica: [
        { opcao: 'Commercial API (GPT, Claude, Gemini)', quando: 'Moderate interaction volume; no sensitive data; fast implementation needed', consideracoes: 'Predictable cost at low volume; provider dependency; GDPR compliance requires contract review' },
        { opcao: 'Open-source (LLaMA, Mistral)', quando: 'Sensitive data that cannot leave the organisation; greater control over the model needed', consideracoes: 'Requires own infrastructure or dedicated cloud; higher upfront investment in setup' },
        { opcao: 'RAG', quando: 'Chatbot answering from internal documentation (catalogues, FAQs, contracts)', consideracoes: 'Recommended for SMEs with structured documentation; reduces hallucinations; integrates with commercial APIs' }
      ],
      acoes: [
        'Identify the channels with the highest volume of repetitive interactions (email, chat, forms)',
        'Select a low-risk pilot channel for initial implementation',
        'Define the scope of automated responses and the thresholds for escalating to a human',
        'Integrate the LLM with existing communication platforms via API',
        'Establish a process for periodically reviewing the quality of generated responses'
      ],
      criterios: [
        { criterio: 'Efficiency', indicador: 'Reduction in average customer response time' },
        { criterio: 'Quality', indicador: 'Resolution rate without escalation to a human' },
        { criterio: 'Satisfaction', indicador: 'Customer experience rating (NPS or equivalent)' },
        { criterio: 'Cost', indicador: 'Cost per interaction before and after implementation' }
      ],
      governanca: 'GDPR: customer interaction data (name, email, conversation history) is personal data. Ensure a legal basis for processing, inform users they are interacting with an automated system, and provide an opt-out mechanism. AI Act: systems interacting with end users are subject to transparency requirements (users must be informed they are interacting with an AI system). Reputational risk: visible failures have a direct impact on the SME\'s image. Set a confidence threshold below which a response is always reviewed by a human before it is sent.'
    },
    'relacionamento-clientes': {
      titulo: 'Customer Relationships',
      area: 'I - Customer Interface',
      requisitos: 'RF1 · RF2 · RF3 · RF4',
      contexto: 'Customer Relationships define the type of relationship the SME establishes with each segment — from reactive support to proactive loyalty-building. In SMEs, this block is often managed informally and is highly time-intensive, with limited capacity to scale. Adopting LLMs makes the relationship more responsive, personalised and data-driven, without requiring a proportional increase in headcount.',
      aplicacoes: [
        '24/7 automated support with personalised, context-appropriate responses',
        'Sentiment analysis of customer feedback, complaints and reviews',
        'Automated post-sale support: follow-up, confirmations and query resolution',
        'Generating personalised proactive communications (follow-ups, renewals, alerts)'
      ],
      orientacaoTecnologica: [
        { opcao: 'Commercial API', quando: 'SMEs without their own infrastructure; need for a quick start; low to moderate interaction volume', consideracoes: 'Lowest barrier to entry; weigh recurring costs against expected volume' },
        { opcao: 'RAG over CRM', quando: 'SMEs with customer history structured in a CRM or internal database', consideracoes: 'Enables responses informed by customer history; recommended for SMEs with organised data' },
        { opcao: 'Fine-tuning', quando: 'Very specific brand tone and language; high interaction volume justifies the investment', consideracoes: 'Higher upfront investment; requires quality training data; suited to more mature adoption stages' }
      ],
      acoes: [
        'Map the customer touchpoints with the highest volume or repetition',
        'Define the tone and the limits of the system\'s autonomy (what it answers automatically versus what it escalates)',
        'Integrate the LLM with the existing CRM for access to customer history',
        'Implement sentiment analysis on feedback channels for early detection of dissatisfaction',
        'Create a process for continuous review and improvement based on escalated cases'
      ],
      criterios: [
        { criterio: 'Responsiveness', indicador: 'Average time to first response to the customer' },
        { criterio: 'Loyalty', indicador: 'Customer retention rate before and after implementation' },
        { criterio: 'Relationship quality', indicador: 'Satisfaction score in AI-assisted interactions' },
        { criterio: 'Escalation', indicador: 'Percentage of cases resolved without human intervention' }
      ],
      governanca: 'GDPR: processing customers\' personal data to personalise the relationship requires an explicit legal basis. Interaction history should not be shared with external models without anonymisation or an appropriate contractual agreement. AI Act: systems that make decisions affecting the customer relationship (e.g., churn risk scoring) may require explainability and human oversight.'
    },
    'atividades-chave': {
      titulo: 'Key Activities',
      area: 'III - Infrastructure Management',
      requisitos: 'RF1 · RF2 · RF3 · RF4',
      contexto: 'Key Activities represent the most important actions an SME must carry out for its business model to work. In SMEs, these activities often include language-intensive tasks — report writing, document analysis, internal and external communications, and knowledge management — that are time-consuming and have a low degree of automation. Adopting LLMs in this block has the potential to free up significant operational capacity.',
      aplicacoes: [
        'Automatic generation of operational reports and executive summaries',
        'Extracting, summarising and categorising information from unstructured documents',
        'Support in drafting commercial proposals, contracts and formal communications',
        'Assistance with software development and generating technical documentation',
        'Automating approval workflows and document triage'
      ],
      orientacaoTecnologica: [
        { opcao: 'Commercial API', quando: 'Text-generation tasks with no sensitive data; need for flexibility across varied tasks', consideracoes: 'Cost scales with token volume; assess exposure of internal documents to the provider' },
        { opcao: 'RAG over internal documentation', quando: 'SMEs with an internal document repository (manuals, processes, contracts, past reports)', consideracoes: 'Recommended for generating context-aware reports; reduces hallucinations in specialised domains' },
        { opcao: 'Local open-source', quando: 'Confidential documents that cannot leave the organisation (financial, legal data)', consideracoes: 'Greater control and privacy; requires supporting infrastructure; suited to SMEs with external technical support' }
      ],
      acoes: [
        'Identify the activities with the highest volume of document production or text analysis',
        'Select a low-criticality pilot process for the first implementation',
        'Define standardised templates and prompts for the most frequent outputs',
        'Establish a mandatory human validation step before publishing or sending outputs',
        'Monitor time saved and output quality to justify scaling up'
      ],
      criterios: [
        { criterio: 'Efficiency', indicador: 'Average document production time before and after implementation' },
        { criterio: 'Quality', indicador: 'Approval rate of outputs without substantive revision' },
        { criterio: 'Internal adoption', indicador: 'Percentage of employees who regularly use the LLM tools' },
        { criterio: 'Savings', indicador: 'Estimated hours freed up per month for higher-value activities' }
      ],
      governanca: 'GDPR: internal documents containing personal data (employees, customers, suppliers) should not be submitted to external APIs without a Data Protection Impact Assessment (DPIA). AI Act: systems supporting internal decisions that affect critical processes must ensure traceability and the ability to audit generated outputs.'
    }
  },
  perguntasJogo: [
    { bloco: 'segmentos-clientes', eixo: 'prontidao', pergunta: 'Can you clearly identify and organise information about your customers?', opcoes: ['No, it\'s all mixed together', 'Sort of, informally', 'Yes, we have that well organised'] },
    { bloco: 'segmentos-clientes', eixo: 'impacto', pergunta: 'Would understanding your customers better help you sell more or serve them better?', opcoes: ['Not a priority right now', 'It would help somewhat', 'It would be a major gain'] },
    { bloco: 'proposta-valor', eixo: 'prontidao', pergunta: 'Do you regularly personalise what you offer to customers, or produce commercial content?', opcoes: ['Rarely', 'Sometimes', 'Yes, frequently'] },
    { bloco: 'proposta-valor', eixo: 'impacto', pergunta: 'Would it make a difference if you could adapt your offer to each customer faster?', opcoes: ['Little difference', 'Some difference', 'A big difference'] },
    { bloco: 'canais', eixo: 'prontidao', pergunta: 'Do you already use digital channels (website, social media, email) to communicate with your customers?', opcoes: ['Barely', 'Some, but not very structured', 'Yes, in an organised way'] },
    { bloco: 'canais', eixo: 'impacto', pergunta: 'Is improving digital communication with customers important to you?', opcoes: ['Not really', 'It would be useful', 'It\'s a priority'] },
    { bloco: 'relacionamento-clientes', eixo: 'prontidao', pergunta: 'Do you have a defined process for customer support and after-sales follow-up?', opcoes: ['No, it\'s case by case', 'It exists, but informally', 'Yes, well defined'] },
    { bloco: 'relacionamento-clientes', eixo: 'impacto', pergunta: 'Would making support faster or more personal be valuable?', opcoes: ['Not urgent', 'It would be good', 'It\'s very important'] },
    { bloco: 'fontes-receita', eixo: 'prontidao', pergunta: 'Do you have services with the potential to grow without a proportional increase in staff?', opcoes: ['No', 'Maybe, partly', 'Yes, clearly'] },
    { bloco: 'fontes-receita', eixo: 'impacto', pergunta: 'Is it important to find new ways to generate revenue?', opcoes: ['Not for now', 'It\'s relevant', 'It\'s a priority'] },
    { bloco: 'atividades-chave', eixo: 'prontidao', pergunta: 'How much of your team\'s time is lost on reports or repetitive administrative tasks?', opcoes: ['Not much', 'Some', 'A lot'] },
    { bloco: 'atividades-chave', eixo: 'impacto', pergunta: 'Would freeing up time from repetitive administrative tasks for other work bring a significant gain?', opcoes: ['Little gain', 'Some gain', 'A big gain'] },
    { bloco: 'recursos-chave', eixo: 'prontidao', pergunta: 'Does your team have computers, internet, and enough digital comfort to try new tools?', opcoes: ['Not very comfortable', 'Reasonably', 'Very comfortable'] },
    { bloco: 'recursos-chave', eixo: 'impacto', pergunta: 'Are you ready to invest in new digital tools?', opcoes: ['Not yet', 'Maybe', 'Yes, we\'re ready'] },
    { bloco: 'parcerias-chave', eixo: 'prontidao', pergunta: 'Do you already work with IT technology providers, cloud services, or external consultants?', opcoes: ['No', 'A little', 'Yes, regularly'] },
    { bloco: 'parcerias-chave', eixo: 'impacto', pergunta: 'Would you be available to create new technology partnerships to move faster?', opcoes: ['Little interest', 'Maybe', 'Yes, quite interested'] },
    { bloco: 'estrutura-custos', eixo: 'prontidao', pergunta: 'Do you have clear visibility into how much you spend on manual tasks or subscriptions?', opcoes: ['Little visibility', 'Some', 'Clear visibility'] },
    { bloco: 'estrutura-custos', eixo: 'impacto', pergunta: 'Is reducing operating costs a priority?', opcoes: ['Not really', 'It\'s relevant', 'It\'s a priority'] }
  ]
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

/**
 * Devolve o conteúdo de uma Ficha de Decisão no idioma atual — a versão
 * inglesa (TRADUCOES_I1_EN.fichas) é uma tradução de trabalho, ainda não
 * revista, por isso sempre que se usa esta função com o site em inglês
 * deve mostrar-se também o aviso 'i3-traducao-indicativa' junto ao
 * conteúdo (ver avisoTraducaoIndicativa() em instrumento3.js).
 */
function tFicha(id) {
  if (obterIdioma() === 'en' && TRADUCOES_I1_EN.fichas && TRADUCOES_I1_EN.fichas[id]) {
    return TRADUCOES_I1_EN.fichas[id];
  }
  return FICHAS[id];
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
