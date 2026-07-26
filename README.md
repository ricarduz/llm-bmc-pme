# llm-bmc-pme

Ferramenta interativa de demonstração do framework de adoção de Large Language
Models (LLM) por Pequenas e Médias Empresas (PME), estruturado no
Business Model Canvas (BMC).

## Enquadramento académico

Este repositório operacionaliza o artefacto central da dissertação
*Adoção de Large Language Models por Pequenas e Médias Empresas: Desafios e
Oportunidades*, submetida para obtenção do grau de Mestre em Engenharia
Informática e Tecnologia Web (Universidade Aberta, em parceria com a UTAD).

Autor: Ricardo Serafim
Orientação: Prof. Doutor Frederico Branco

A ferramenta instancia sequencialmente os três instrumentos descritos no
Capítulo 5 da dissertação e serve de suporte ao Protocolo de Demonstração
(Secção 4.2.1) e ao Protocolo de Avaliação (Secção 4.2.2) do framework.

## Os três instrumentos

1. **Diagnóstico de Pré-requisitos** — avalia prontidão e impacto por bloco do BMC
2. **Matriz LLM × BMC** — mapeia aplicações, oportunidades e riscos por bloco (Tabela 10)
3. **Fichas de Decisão** — orientação operacional detalhada para os 4 blocos com maior densidade de evidência (Canais, Relacionamento com Clientes, Atividades-Chave, Recursos-Chave)

## Percurso

```
index.html          Perfil da empresa → grelha explicativa do BMC → instrumentos + consentimento
instrumento1.html    Instrumento 1 — percurso progressivo, bloco a bloco
instrumento2.html    Instrumento 2 — matriz completa dos blocos elegíveis
instrumento3.html    Instrumento 3 — fichas de decisão (por abas, se houver mais do que uma)
resultados.html      Satisfação + contacto → resultado do diagnóstico + download
```

Cada página é só HTML/CSS/JS estático — não há build, nem framework, nem
dependências para instalar. A navegação entre "passos" dentro do index e
de resultados é feita em JavaScript (mostrar/esconder secções), não são
páginas à parte.

## Estrutura de ficheiros

```
css/style.css          sistema de design partilhado (paleta UAb, componentes)
js/data.js              conteúdo dos instrumentos (Apêndice da dissertação) + classificações (prioridade BMC, PME/UE)
js/state.js             leitura/escrita do estado da sessão em localStorage
js/i18n.js              dicionário e motor de tradução PT/EN
js/modal.js             motor genérico de modais (usado pelo "Sobre" e pelas explicações dos instrumentos)
js/index.js             lógica da página inicial
js/instrumento1.js      lógica do Instrumento 1
js/instrumento2.js      lógica do Instrumento 2
js/instrumento3.js      lógica do Instrumento 3
js/resultados.js        lógica da página de resultados
assets/                 favicon e logótipos institucionais
```

## Como usar

Versão publicada: https://ricarduz.github.io/llm-bmc-pme/ *(a atualizar após o primeiro deploy)*

Desenvolvimento local — não requer build nem dependências; basta abrir
`index.html` num navegador, ou servir a pasta com qualquer servidor
estático (recomendado para testar o download do resumo — ver nota abaixo).

## Idiomas

Seletor PT/EN no cabeçalho de todas as páginas (a preferência fica
guardada no navegador e aplica-se a todas as páginas). Cobertura atual:
- Totalmente traduzidos: página inicial, Instrumento 1, Matriz do
  Instrumento 2, página de resultados.
- Só em português, por agora: o conteúdo detalhado das 4 Fichas de
  Decisão do Instrumento 3.

## Dados e privacidade

As respostas ficam guardadas no navegador (`localStorage`) enquanto se
usa a ferramenta. No final:
- **Resumo para o utilizador**: um ficheiro `.html` autónomo, pronto a
  abrir em qualquer computador — não é pedido nem é necessário nenhum
  ficheiro técnico (JSON).
- **Contacto por email (opcional)**: quem quiser receber as conclusões
  finais do estudo pode deixar o email, com consentimento explícito. É o
  único dado pessoal identificativo alguma vez recolhido, e só com esta
  ação — nunca por defeito.
- **Envio para investigação (opcional)**: ao descarregar o resumo, os
  dados do diagnóstico (sem identificação pessoal) podem também ser
  enviados para um repositório central de apoio à investigação, através
  de um Google Apps Script Web App. **Este envio está desativado por
  omissão** — só ativa depois de se preencher `GOOGLE_SHEETS_URL` no
  topo de `js/resultados.js`.
- **Classificação de PME**: o Passo 1 calcula a classificação da empresa
  segundo a Recomendação 2003/361/CE e bloqueia o avanço se a empresa não
  for uma PME — o framework não se aplica a empresas de maior dimensão.

## Identidade visual

A paleta de cores segue o Manual de Normas Gráficas da UAb (preto, azul
institucional `#6D8297` e respetivo tom a 50%, cinzento `#96969A`). A
tipografia institucional é a Flama Basic; por ser uma fonte comercial sem
distribuição gratuita para web, usa-se a Fira Sans como substituta próxima
até haver licença de webfont.

Os logótipos da UAb e da UTAD (`assets/logo-uab-placeholder.jpeg` e
`assets/logo-utad-placeholder.jpeg`) devem ser substituídos pelos
ficheiros oficiais fornecidos pelas duas instituições — o manual da UAb
estabelece explicitamente que a assinatura não pode ser redesenhada, só
reproduzida a partir dos ficheiros originais. A versão a cores da
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
