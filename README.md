# LLM em PME — Framework de adoção de LLM estruturado no Business Model Canvas

Ferramenta web interativa desenvolvida como artefacto da dissertação de mestrado **“Adoção de LLMs por PMEs – Desafios e Oportunidades”**, no Mestrado em Engenharia Informática e Tecnologia Web da **Universidade Aberta (UAb)** em parceria com a **Universidade de Trás-os-Montes e Alto Douro (UTAD)**.

A aplicação operacionaliza um framework para apoiar a identificação, priorização e aprofundamento de oportunidades de utilização de **Large Language Models (LLMs)** em **Pequenas e Médias Empresas (PMEs)**, usando os nove blocos do **Business Model Canvas (BMC)** como estrutura de análise.

> **Estado do projeto:** artefacto funcional para demonstração e avaliação académica.

---

## 1. Objetivo

O projeto transforma o framework conceptual da dissertação numa ferramenta interativa que permite:

- caracterizar uma PME e confirmar a sua classificação;
- analisar os nove blocos do Business Model Canvas;
- avaliar a combinação entre **prontidão** e **impacto**;
- atribuir uma prioridade a cada bloco;
- identificar aplicações potenciais de LLM;
- apresentar oportunidades e riscos associados;
- selecionar áreas que justificam análise adicional;
- consultar fichas de decisão com orientação operacional;
- gerar um relatório final autónomo;
- recolher, mediante consentimento, dados para a avaliação académica do artefacto.

A lógica de negócio está separada da apresentação: os dados e regras principais encontram-se em `js/data.js`, enquanto cada percurso de utilização possui a sua própria lógica JavaScript.

---

## 2. Enquadramento académico

**Título da dissertação:**  
*Adoção de LLMs por PMEs – Desafios e Oportunidades*

**Autor:** Ricardo Filipe Isaías da Silva Serafim  
**Número:** 2302605  
**Área:** Engenharia Informática  
**Orientador:** Prof. Doutor Frederico Augusto dos Santos Branco  
**Instituições:** Universidade Aberta / UTAD

A proposta original define como objetivo estudar os desafios e oportunidades associados à adoção de LLMs por PMEs, com especial atenção à eficiência operacional, tomada de decisão e competitividade.

O artefacto desenvolvido enquadra-se numa abordagem de **Design Science Research Methodology (DSRM)**, complementada por uma **Systematic Literature Review (SLR)**. A DSRM é utilizada para construir e avaliar o artefacto, enquanto a revisão da literatura fornece a base conceptual e científica para os instrumentos e conteúdos utilizados.

O desenho metodológico segue a lógica de investigação orientada para artefactos: **problema → objetivos → construção → demonstração → avaliação → comunicação**.

---

## 3. Conceito do framework

O framework organiza a análise através dos **9 blocos do Business Model Canvas**:

1. Segmentos de Clientes
2. Proposta de Valor
3. Canais
4. Relacionamento com Clientes
5. Fontes de Receita
6. Atividades-Chave
7. Recursos-Chave
8. Parcerias-Chave
9. Estrutura de Custos

No Instrumento 2, estes blocos são ainda agrupados em quatro áreas:

- **Interface com o Cliente**
- **Produto/Oferta**
- **Gestão de Infraestrutura**
- **Aspetos Financeiros**

A ferramenta não assume que a adoção de LLM deve ocorrer em todos os blocos. O objetivo é identificar onde existe uma combinação suficientemente interessante entre necessidade/oportunidade e capacidade de adoção.

---

## 4. Os três instrumentos

O artefacto académico é constituído por três instrumentos complementares.

### Instrumento 1 — Diagnóstico de Pré-requisitos

Avalia cada bloco do BMC através de duas dimensões:

- **Prontidão** — condições existentes na PME para explorar a oportunidade;
- **Impacto** — relevância potencial da melhoria proporcionada pela utilização de LLM.

Cada dimensão é avaliada numa escala de 1 a 3.

O cruzamento entre ambas produz uma classificação de prioridade:

| Prontidão | Impacto 1 | Impacto 2 | Impacto 3 |
|---|---|---|---|
| 3 | Diferir | Relevante | Prioritário |
| 2 | Diferir | Relevante | Prioritário |
| 1 | Diferir | Diferir | Investimento necessário |

As classificações são calculadas pela função `classificarBloco()` em `js/data.js`, evitando que a regra exista duplicada em diferentes páginas.

---

### Instrumento 2 — Matriz LLM × BMC

Para os blocos considerados elegíveis, a matriz apresenta:

- aplicações possíveis de LLM;
- oportunidades associadas;
- riscos e limitações.

O utilizador pode selecionar os blocos que pretende aprofundar.

O conteúdo da matriz está centralizado em `js/data.js`, permitindo manter a mesma base de conhecimento entre o percurso académico e o percurso destinado a gestores de PME.

---

### Instrumento 3 — Fichas de Decisão

O terceiro instrumento transforma a análise anterior numa orientação mais operacional.

Existem atualmente quatro fichas completas:

- **Recursos-Chave**
- **Canais**
- **Relacionamento com Clientes**
- **Atividades-Chave**

Cada ficha segue uma estrutura comum:

1. Contexto
2. Aplicações
3. Orientação tecnológica
4. Ações
5. Critérios de avaliação
6. Governança e conformidade

A secção de governança inclui considerações relacionadas com **RGPD** e **AI Act**, quando aplicáveis ao bloco analisado.

As fichas só são apresentadas quando foram selecionadas no Instrumento 2.

---

## 5. Dois percursos de utilização

A aplicação começa em `index.html` e permite escolher entre dois públicos.

### Percurso PME

Destinado a gestores/proprietários de PMEs.

```text
index.html
    ↓
pme.html
    ↓
Consentimento
    ↓
Perfil da empresa
    ↓
18 perguntas de diagnóstico
    ↓
Processamento
    ↓
Relatório personalizado
    ↓
Satisfação / email opcional
    ↓
Conclusão
```

O percurso foi desenhado para esconder a terminologia académica dos instrumentos. O gestor responde a perguntas em linguagem de negócio e recebe o resultado sem precisar de conhecer previamente o BMC, a DSRM ou a estrutura interna do framework.

O diagnóstico utiliza **18 perguntas**, duas por cada um dos nove blocos do BMC:

- uma para prontidão;
- uma para impacto.

O percurso inclui ainda:

- setor;
- número de colaboradores;
- faturação;
- país;
- região;
- classificação da empresa segundo os critérios implementados para PME.

Se a empresa não for classificada como PME, o percurso é bloqueado.

---

### Percurso de especialista

Destinado ao painel académico de avaliação do artefacto.

```text
index.html
    ↓
entrevista.html
    ↓
Perfil do especialista + autorização
    ↓
cenario.html
    ↓
Instrumento 1
    ↓
Instrumento 2
    ↓
Instrumento 3
    ↓
resultados.html
```

O painel pode:

- percorrer os instrumentos autonomamente;
- utilizar um cenário pré-preenchido;
- editar as respostas do cenário;
- selecionar blocos para aprofundamento;
- avaliar o artefacto;
- apresentar uma reflexão livre.

São disponibilizados **3 cenários de PME europeia** para facilitar a demonstração do framework.

Os perfis de especialista utilizados na avaliação são:

- Gestor / Proprietário de PME;
- Profissional de TI / Transformação Digital;
- Investigador / Académico.

---

## 6. Avaliação do artefacto

A página `resultados.html` recolhe a avaliação do painel.

Os critérios são:

- **Utilidade percebida**
- **Aplicabilidade**
- **Consistência com a literatura**
- **Completude**

Os critérios são avaliados numa escala de 1 a 5 e podem ser acompanhados por comentários.

A avaliação inclui ainda uma **reflexão livre com um mínimo de 75 palavras**.

A estrutura permite guardar o perfil do especialista juntamente com a avaliação, possibilitando posteriormente a análise das respostas por perfil.

---

## 7. Relatórios

Existem dois mecanismos de geração de resultados.

### Relatório da PME

O percurso `pme.html` gera um ficheiro HTML autónomo contendo, entre outros elementos:

- caracterização da empresa;
- classificação da PME;
- representação dos nove blocos do BMC;
- prioridades identificadas;
- oportunidades associadas;
- conteúdo das fichas disponíveis para os blocos relevantes;
- informação de suporte à interpretação.

### Relatório da avaliação

O percurso `resultados.html` gera uma síntese da sessão de avaliação, incluindo:

- identificação do perfil do especialista;
- resultados do diagnóstico;
- matriz e fichas relevantes;
- avaliação dos critérios;
- comentários;
- reflexão livre.

Os relatórios são HTML autónomo, pelo que não dependem da aplicação para serem posteriormente consultados ou impressos.

A construção dos relatórios utiliza funções partilhadas em:

```text
js/relatorio-utils.js
```

O código inclui escaping do conteúdo introduzido pelo utilizador antes de o inserir no HTML exportado.

---

## 8. Arquitetura técnica

A aplicação é deliberadamente simples e não utiliza frameworks de frontend nem um processo de build.

### Tecnologias

- HTML5
- CSS3
- JavaScript
- `localStorage`
- Google Apps Script
- Google Sheets

Não existem:

- `package.json`;
- `node_modules`;
- bundler;
- transpiler;
- framework JavaScript;
- servidor backend próprio.

A aplicação pode ser executada como um conjunto de ficheiros estáticos.

---

## 9. Estrutura do repositório

```text
llm-bmc-pme/
│
├── index.html
├── pme.html
├── entrevista.html
├── cenario.html
├── instrumento1.html
├── instrumento2.html
├── instrumento3.html
├── resultados.html
├── materiais.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── data.js
│   ├── state.js
│   ├── i18n.js
│   ├── modal.js
│   ├── index.js
│   ├── pme.js
│   ├── entrevista.js
│   ├── cenario.js
│   ├── instrumento1.js
│   ├── instrumento2.js
│   ├── instrumento3.js
│   ├── resultados.js
│   ├── relatorio-utils.js
│   └── materiais.js
│
├── assets/
│   ├── favicon.svg
│   ├── favicon-180.png
│   ├── logo-uab-placeholder.jpeg
│   ├── logo-utad-placeholder.jpeg
│   ├── instrumento1.pdf
│   ├── instrumento2.pdf
│   └── instrumento3.pdf
│
├── apps-script/
│   ├── Code.gs
│   └── README.md
│
├── estatico/
│   ├── index-estatico.html
│   ├── resultados-estatico.html
│   └── README.md
│
├── LICENSE
└── README.md
```

### Responsabilidade dos principais ficheiros

| Ficheiro | Responsabilidade |
|---|---|
| `index.html` | Entrada e seleção do percurso |
| `pme.html` | Percurso simplificado para gestores de PME |
| `entrevista.html` | Introdução e autorização do painel |
| `cenario.html` | Seleção dos cenários de demonstração |
| `instrumento1.html` | Diagnóstico de pré-requisitos |
| `instrumento2.html` | Matriz LLM × BMC |
| `instrumento3.html` | Fichas de decisão |
| `resultados.html` | Avaliação e síntese da sessão |
| `materiais.html` | Consulta/download dos materiais dos instrumentos |
| `js/data.js` | Dados, conteúdo dos instrumentos e regras de classificação |
| `js/state.js` | Persistência da sessão em `localStorage` |
| `js/i18n.js` | Tradução e conteúdos PT/EN |
| `js/pme.js` | Lógica do percurso PME e relatório |
| `js/instrumento1.js` | Lógica do Instrumento 1 |
| `js/instrumento2.js` | Lógica do Instrumento 2 |
| `js/instrumento3.js` | Lógica do Instrumento 3 |
| `js/resultados.js` | Avaliação do painel e relatório |
| `js/relatorio-utils.js` | Funções comuns para exportação |
| `js/cenario.js` | Cenários de demonstração |
| `apps-script/Code.gs` | Endpoint Google Apps Script para recolha de dados |

---

## 10. Gestão do estado

A sessão é mantida no navegador através de `localStorage`.

A chave principal é definida em:

```text
js/state.js
```

O estado inclui, consoante o percurso:

- perfil da empresa;
- classificação da PME;
- diagnóstico dos nove blocos;
- blocos selecionados;
- perfil do especialista;
- avaliação;
- reflexão;
- `sessionId`.

A utilização de `localStorage` permite que a navegação entre as páginas do percurso mantenha os dados sem necessidade de backend próprio.

No final de uma sessão concluída, os dados da sessão são removidos do navegador.

---

## 11. Dados e privacidade

A aplicação foi desenhada para minimizar a recolha de dados pessoais.

### Dados locais

As respostas são mantidas no navegador durante a sessão.

### Email

O email é opcional.

Só é recolhido quando o participante escolhe deixar o contacto e aceita explicitamente a sua utilização para receber as conclusões finais do estudo.

### Recolha para investigação

Quando configurado, o site envia os dados para uma Google Sheet através de um Google Apps Script Web App.

São utilizadas três folhas:

```text
Diagnostico
Avaliacao
Contacto
```

O `sessionId` permite evitar duplicação quando a mesma sessão é enviada em diferentes momentos.

O código de integração encontra-se em:

```text
apps-script/Code.gs
```

O código do repositório é uma cópia de referência. O código efetivamente executado pelo Google Apps Script vive no projeto Apps Script associado à Google Sheet.

---

## 12. Google Apps Script

O endpoint recebe pedidos `POST` enviados pela aplicação e encaminha-os segundo o tipo:

```text
contacto
diagnostico
avaliacao
```

A folha `Diagnostico` contém o perfil da PME e uma coluna para cada um dos nove blocos do BMC.

A folha `Avaliacao` contém o perfil do especialista, os critérios de avaliação e a reflexão.

A folha `Contacto` contém os contactos autorizados para receber informação sobre os resultados finais.

### Atenção ao deployment

Alterar `apps-script/Code.gs` no repositório **não altera automaticamente** o código publicado no Google Apps Script.

Depois de uma alteração no Apps Script é necessário criar uma nova versão da implementação Web App.

As URLs dos endpoints são configuradas nas constantes existentes em:

```text
js/pme.js
js/resultados.js
```

Não devem ser introduzidas credenciais ou outros segredos no código público do repositório.

---

## 13. Internacionalização

A interface suporta:

- Português (`pt`)
- Inglês (`en`)

A lógica de tradução está centralizada em:

```text
js/i18n.js
```

A preferência de idioma é guardada no navegador e reutilizada entre páginas.

A versão inglesa do conteúdo das Fichas de Decisão é tratada na própria aplicação como **tradução indicativa**, uma vez que ainda não corresponde a uma revisão editorial equivalente à versão portuguesa.

---

## 14. Identidade visual

A interface utiliza uma identidade visual inspirada nas normas gráficas da Universidade Aberta.

O sistema visual principal está centralizado em:

```text
css/style.css
```

São utilizados os elementos institucionais fornecidos para a UAb e UTAD.

A tipografia web utiliza uma alternativa compatível com a identidade pretendida, uma vez que a fonte institucional original não está distribuída como webfont neste projeto.

---

## 15. Materiais académicos

A pasta `assets/` inclui as versões PDF dos três instrumentos:

```text
assets/instrumento1.pdf
assets/instrumento2.pdf
assets/instrumento3.pdf
```

A página `materiais.html` disponibiliza estes materiais através da interface da aplicação.

A pasta `estatico/` contém 2 versões HTML de leitura, sem dependência da lógica JavaScript da aplicação, para documentação ou anexo ao trabalho académico: `index-estatico.html` (visão geral do framework, os dois percursos, e um exemplo ilustrativo de diagnóstico completo) e `resultados-estatico.html` (o instrumento de avaliação do painel de especialistas, em branco). O conteúdo detalhado de cada instrumento já está coberto pelos PDFs em `assets/` — não duplicado aqui.

---

## 16. Execução local

Não é necessário instalar dependências.

A opção mais simples é abrir:

```text
index.html
```

diretamente no navegador.

Para desenvolvimento e testes, é preferível utilizar um servidor HTTP estático local.

Por exemplo, com Python:

```bash
python -m http.server 8000
```

Depois abrir:

```text
http://localhost:8000/
```

Isto é especialmente útil para testar o comportamento dos downloads e a comunicação com serviços externos.

---

## 17. Publicação

O projeto foi estruturado para publicação como site estático.

A versão de produção atualmente associada ao projeto é:

```text
https://ricarduz.github.io/llm-bmc-pme/
```

Uma publicação GitHub Pages requer apenas que os ficheiros do repositório sejam disponibilizados como conteúdo estático.

Não existe um processo de build.

---

## 18. Fluxo lógico resumido

```text
                         ┌─────────────────┐
                         │    index.html   │
                         └────────┬────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
             ┌─────────────┐             ┌──────────────┐
             │   Percurso  │             │   Percurso   │
             │     PME     │             │  especialista│
             └──────┬──────┘             └──────┬───────┘
                    │                           │
                    ▼                           ▼
             Perfil da PME               Perfil / autorização
                    │                           │
                    ▼                           ▼
             18 perguntas                  Cenário ou
                    │                    preenchimento
                    │                           │
                    ▼                           ▼
             Diagnóstico ───────────────► Instrumento 1
                    │                           │
                    │                           ▼
                    │                     Instrumento 2
                    │                           │
                    ▼                           ▼
              Relatório                    Instrumento 3
                                                │
                                                ▼
                                          Avaliação
                                                │
                                                ▼
                                            Síntese
```

Apesar de existirem dois percursos de apresentação, ambos utilizam a mesma base conceptual e os mesmos dados dos instrumentos.

---

## 19. Princípios de implementação

O projeto segue alguns princípios importantes:

### Uma única fonte para o conteúdo

Os conteúdos científicos dos instrumentos estão concentrados em `js/data.js`, evitando duplicações entre páginas.

### Uma única regra de classificação

A prioridade é calculada por `classificarBloco()`, a partir da matriz Prontidão × Impacto.

### Separação entre conteúdo e apresentação

Os dados do framework estão separados da lógica de renderização e da estrutura HTML.

### Reutilização entre os dois públicos

O percurso PME utiliza a mesma base conceptual do percurso académico, mas adapta a linguagem e a experiência de utilização.

### Ausência de backend próprio

A aplicação funciona como site estático. A recolha de dados, quando autorizada e configurada, é delegada para Google Apps Script + Google Sheets.

### Avaliação integrada

O artefacto inclui mecanismos de demonstração, recolha de avaliação e geração de síntese, permitindo utilizá-lo como instrumento de suporte à avaliação prevista na investigação.

---

## 20. Validação técnica

O código JavaScript do projeto foi estruturado para execução direta no navegador e os ficheiros JavaScript podem ser validados com:

```bash
node --check js/data.js
node --check js/pme.js
node --check js/instrumento1.js
node --check js/instrumento2.js
node --check js/instrumento3.js
node --check js/resultados.js
```

Não existe uma suite de testes automatizados dedicada no repositório.

A validação funcional deve ser realizada através dos dois percursos da aplicação, incluindo:

- navegação;
- seleção dos nove blocos;
- cálculo das prioridades;
- cenários;
- geração dos relatórios;
- mudança de idioma;
- limpeza do estado;
- envio opcional para Google Sheets.

---

## 21. Limitações conhecidas

O projeto é um artefacto académico e não pretende ser uma plataforma empresarial de produção.

Entre as limitações atuais encontram-se:

- ausência de backend próprio;
- persistência baseada no navegador;
- dependência opcional de Google Apps Script para recolha dos dados;
- ausência de autenticação de utilizadores;
- ausência de base de dados própria;
- tradução inglesa das Fichas de Decisão ainda indicativa;
- versões estáticas HTML mantidas separadamente da aplicação interativa;
- ausência de testes automatizados end-to-end.

Estas características são compatíveis com o objetivo principal do projeto: **demonstrar e avaliar o framework desenvolvido no contexto da dissertação**.

---

## 22. Relação com a investigação

A aplicação não constitui apenas um website de apoio. É a **instanciação operacional do artefacto de investigação**.

A relação entre investigação e implementação pode ser resumida da seguinte forma:

| Investigação | Implementação |
|---|---|
| Business Model Canvas | `BMC_BLOCOS` e mapa dos 9 blocos |
| Instrumento 1 | `instrumento1.html` + `instrumento1.js` |
| Instrumento 2 | `instrumento2.html` + `instrumento2.js` |
| Instrumento 3 | `instrumento3.html` + `instrumento3.js` |
| Diagnóstico PME simplificado | `pme.html` + `pme.js` |
| Cenários de demonstração | `cenario.html` + `cenario.js` |
| Avaliação do artefacto | `resultados.html` + `resultados.js` |
| Dados dos instrumentos | `js/data.js` |
| Persistência da sessão | `js/state.js` |
| Relatórios | `js/relatorio-utils.js`, `pme.js`, `resultados.js` |
| Recolha de dados | Google Apps Script + Google Sheets |

Desta forma, o repositório permite relacionar diretamente os elementos do artefacto descritos na dissertação com a sua implementação técnica.

---

## 23. Autor e contacto

**Ricardo Filipe Isaías da Silva Serafim**  
Mestrado em Engenharia Informática e Tecnologia Web  
Universidade Aberta / UTAD  
Número de estudante: 2302605

Email académico:

```text
2302605@estudante.uab.pt
```

---

## 24. Licença

Este projeto é distribuído sob a licença **MIT**.

Consultar o ficheiro:

```text
LICENSE
```

Ao reutilizar o artefacto ou partes substanciais da sua implementação, recomenda-se a referência à dissertação que lhe deu origem.

---

## 25. Referência da dissertação

> Serafim, R. F. I. S. — *Adoção de LLMs por PMEs – Desafios e Oportunidades*. Mestrado em Engenharia Informática e Tecnologia Web, Universidade Aberta / Universidade de Trás-os-Montes e Alto Douro.

