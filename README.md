# llm-bmc-pme

Ferramenta interativa de demonstração do framework de adoção de Large Language
Models (LLM) por Pequenas e Médias Empresas (PME), estruturado no
Business Model Canvas (BMC).

## Enquadramento académico

Este repositório operacionaliza o artefacto central da dissertação
*Adoção de Large Language Models por Pequenas e Médias Empresas: Desafios e
Oportunidades*, submetida para obtenção do grau de Mestre em Engenharia
Informática e Tecnologia Web (Universidade Aberta, em parceria com a UTAD).

Autor: Ricardo Isaías Serafim (2302605@estudante.uab.pt)
Orientação: Prof. Doutor Frederico Branco

A ferramenta instancia sequencialmente os três instrumentos descritos no
Capítulo 5 da dissertação e serve de suporte ao Protocolo de Demonstração
(Secção 4.2.1) e ao Protocolo de Avaliação (Secção 4.2.2) do framework.

## Os três instrumentos

1. **Diagnóstico de Pré-requisitos** — avalia prontidão e impacto por bloco do BMC
2. **Matriz LLM × BMC** — mapeia aplicações, oportunidades e riscos por bloco (Tabela 10)
3. **Fichas de Decisão** — orientação operacional detalhada para os 4 blocos com maior densidade de evidência (Canais, Relacionamento com Clientes, Atividades-Chave, Recursos-Chave)

## Percurso

A ferramenta bifurca logo à entrada em dois públicos, com a mesma lógica
de classificação e o mesmo conteúdo por trás, mas apresentação distinta:

```
index.html          Bifurcação: "Sou uma PME" ou "Sou especialista do painel"

  → PME:
  pme.html           Fluxo único e contínuo (o "jogo") — consentimento →
                     perfil da empresa → 18 perguntas em linguagem de
                     gestor, sem nomes de instrumentos à vista → relatório
                     embutido (canvas BMC + oportunidades) → satisfação →
                     download opcional com email → concluir (apaga os
                     dados deste navegador)

  → Especialista (percurso académico, tal como descrito no Capítulo 4/6
    da dissertação):
  entrevista.html    Apresentação do protocolo (vídeo placeholder + texto),
                     perfil do especialista (Gestor PME / Profissional de
                     TI / Académico — Tabela 4) e autorização
  cenario.html       Escolher entre percorrer os instrumentos de forma
                     autónoma ou partir de um de 3 cenários de PME
                     europeia pré-preenchidos (editáveis a partir daí)
  instrumento1.html  Instrumento 1 — percurso progressivo, bloco a bloco
  instrumento2.html  Instrumento 2 — matriz completa dos blocos elegíveis
  instrumento3.html  Instrumento 3 — fichas de decisão (por abas, se houver mais do que uma)
  resultados.html    Avaliação (critérios variam por perfil — Tabela 4 —
                     + reflexão livre de 75 palavras) → download → concluir
```

Cada página é só HTML/CSS/JS estático — não há build, nem framework, nem
dependências para instalar. A navegação entre "passos" dentro de cada
página é feita em JavaScript (mostrar/esconder secções), não são páginas
à parte.

## Estrutura de ficheiros

```
css/style.css           sistema de design partilhado (paleta UAb, componentes)
js/data.js              conteúdo dos instrumentos (Apêndice da dissertação) + classificações (prioridade BMC, PME/UE)
js/state.js             leitura/escrita do estado da sessão em localStorage
js/i18n.js              dicionário e motor de tradução PT/EN
js/modal.js             motor genérico de modais (usado pelo "Sobre" e pelas explicações dos instrumentos)
js/index.js             lógica da página de bifurcação
js/pme.js               lógica do percurso PME (o "jogo" + relatório exportável)
js/entrevista.js        lógica da página de apresentação do protocolo + perfil do especialista
js/cenario.js           os 3 cenários de PME pré-preenchidos + lógica de aplicação ao estado
js/instrumento1.js      lógica do Instrumento 1
js/instrumento2.js      lógica do Instrumento 2
js/instrumento3.js      lógica do Instrumento 3
js/resultados.js        lógica da página de avaliação do painel de especialistas
js/relatorio-utils.js   funções partilhadas entre pme.js e resultados.js para construir os relatórios exportados (escape de HTML, imagens em base64, rótulos de escalão)
assets/                 favicon e logótipos institucionais
apps-script/            cópia de referência do Google Apps Script (o código que corre de facto vive na Google Sheet — ver apps-script/README.md)
estatico/               ⚠ o propósito mantém-se (instantâneos HTML não-interativos, para anexar à dissertação sem depender de JavaScript) — mas os 5 ficheiros atuais descrevem a estrutura ANTIGA (um só index.html com perfil + grelha BMC + os 3 instrumentos todos juntos), anterior à separação em dois percursos; precisam de ser regenerados para refletir pme.html/entrevista.html/cenario.html/instrumento1-3.html/resultados.html, ver estatico/README.md
```

## Como usar

Versão publicada: https://ricarduz.github.io/llm-bmc-pme/ *(a atualizar após o primeiro deploy)*

Desenvolvimento local — não requer build nem dependências; basta abrir
`index.html` num navegador, ou servir a pasta com qualquer servidor
estático (recomendado para testar o download do resumo — ver nota abaixo).

## Idiomas

Seletor PT/EN no cabeçalho de todas as páginas (a preferência fica
guardada no navegador e aplica-se a todas as páginas), com uma exceção:
`entrevista.html` já teve o seletor removido e reposto ao longo do
projeto — confirmar o estado atual antes de assumir. As traduções das 4
Fichas de Decisão do Instrumento 3 (e os relatórios exportados que as
incluem) são marcadas como indicativas, por serem uma tradução direta
ainda por rever com mais cuidado editorial.

## Dados e privacidade

As respostas ficam guardadas no navegador (`localStorage`) enquanto se
usa a ferramenta. No final:
- **Relatório/resumo para o utilizador**: um ficheiro `.html` autónomo,
  pronto a abrir (ou imprimir em A4) em qualquer computador — não é
  pedido nem é necessário nenhum ficheiro técnico (JSON). O texto livre
  (reflexão, comentários, email) é escapado antes de entrar no ficheiro
  (`js/relatorio-utils.js`), para não partir a estrutura do HTML nem
  abrir uma via de execução de código.
- **Contacto por email (opcional)**: quem quiser receber as conclusões
  finais do estudo pode deixar o email, com consentimento explícito. É o
  único dado pessoal identificativo alguma vez recolhido, e só com esta
  ação — nunca por defeito.
- **Envio para investigação (opcional)**: os dados (sem identificação
  pessoal, já traduzidos para texto legível) podem ser enviados para uma
  Google Sheet através de um Apps Script Web App, em três folhas:
  `Diagnostico` (percurso PME), `Avaliacao` (percurso especialista, com
  o perfil E1/E2/E3 — Tabela 4), e `Contacto` (email, com a origem
  PME/especialista). O envio só dispara em dois momentos — descarregar
  o relatório/resumo, ou concluir a sessão — usando um `sessionId` para
  identificar linhas da mesma sessão. Os URLs de envio
  (`GOOGLE_SHEETS_URL` em `js/resultados.js`, `GOOGLE_SHEETS_URL_PME`
  em `js/pme.js`) já estão preenchidos e o envio está ativo — para
  desativar, basta esvaziar a constante. Ver `apps-script/Code.gs` para
  o código do lado do Google — mudanças aí exigem sempre um redeploy
  manual (Implementar → Gerir → nova versão).
- **Classificação de PME**: calculada segundo a Recomendação
  2003/361/CE a partir de colaboradores + faturação, tanto no percurso
  PME como nos 3 cenários de exemplo do percurso de especialistas.

## Identidade visual

A paleta de cores segue o Manual de Normas Gráficas da UAb (preto, azul
institucional `#6D8297` e respetivo tom a 50%, cinzento `#96969A`). A
tipografia institucional é a Flama Basic; por ser uma fonte comercial sem
distribuição gratuita para web, usa-se a Fira Sans como substituta próxima
até haver licença de webfont.

Os logótipos da UAb e da UTAD (`assets/logo-uab-placeholder.jpeg` e
`assets/logo-utad-placeholder.jpeg` — o nome do ficheiro ficou de quando
eram só placeholders, mas já são os ficheiros oficiais fornecidos pelas
duas instituições) seguem a norma da UAb, que estabelece explicitamente
que a assinatura não pode ser redesenhada, só reproduzida a partir dos
ficheiros originais. A versão a cores da
assinatura só deve ser aplicada sobre fundo branco — por isso o
cabeçalho e o rodapé têm fundo branco fixo, independentemente do resto
da página.

## Estado do conteúdo

Instrumento 1, Instrumento 2 (Matriz completa, Tabela 10) e as 4 Fichas
de Decisão do Instrumento 3 estão completos e confirmados contra o
Apêndice de Instrumentos da dissertação.

## Licença

Distribuído sob licença MIT — ver [LICENSE](LICENSE). Se reutilizar este
artefacto, agradece-se a citação da dissertação de origem.
