# llm-bmc-pme

Ferramenta interativa de demonstração do framework de adoção de Large Language Models (LLM) por Pequenas e Médias Empresas (PME), estruturado no Business Model Canvas (BMC).

## Enquadramento académico

Este repositório operacionaliza o artefacto central da dissertação *Adoção de Large Language Models por Pequenas e Médias Empresas: Desafios e Oportunidades*, submetida para obtenção do grau de Mestre em Engenharia Informática e Tecnologia Web (Universidade Aberta, em parceria com a UTAD).

Autor: Ricardo Isaías Serafim (m2302605@estudante.uab.pt)
Orientação: Prof. Doutor Frederico Branco

A ferramenta instancia sequencialmente os três instrumentos descritos no Capítulo 5 da dissertação e serve de suporte ao Protocolo de Demonstração (Secção 4.2.1) e ao Protocolo de Avaliação (Secção 4.2.2) do framework.

## Os três instrumentos

1. **Diagnóstico de Pré-requisitos** — avalia prontidão e impacto por bloco do BMC
2. **Matriz LLM × BMC** — mapeia aplicações, oportunidades e riscos por bloco
3. **Fichas de Decisão** — orientação operacional para os blocos prioritários com ficha disponível

## Estrutura

```
index.html          Ecrã 0 — apresentação e consentimento
instrumento1.html   Ecrã 1 — Diagnóstico de Pré-requisitos
instrumento2.html   Ecrã 2 — Matriz LLM × BMC
instrumento3.html   Ecrã 3 — Fichas de Decisão
resultados.html     Ecrã 4 — síntese e exportação
css/style.css        sistema de design partilhado
js/data.js            conteúdo dos instrumentos (fonte: Apêndice da dissertação)
js/state.js           gestão de estado em localStorage
js/instrumentoN.js    lógica específica de cada ecrã
```

## Como usar

Versão publicada: https://ricarduz.github.io/llm-bmc-pme/ *(a atualizar após o primeiro deploy)*

Desenvolvimento local — não requer build nem dependências; basta abrir
`index.html` num navegador, ou servir a pasta com qualquer servidor estático.

## Dados e privacidade

A ferramenta não recolhe dados pessoais identificativos por defeito. Os resultados de cada sessão são processados localmente no navegador (`localStorage`) e só saem do dispositivo se o utilizador optar por exportar o registo em JSON.

## Identidade visual

A paleta de cores segue o Manual de Normas Gráficas da UAb (preto, azul institucional `#6D8297` e respetivo tom a 50%, cinzento `#96969A`). A tipografia institucional é a Flama Basic; por ser uma fonte comercial sem distribuição gratuita para web, usa-se a Fira Sans como substituta próxima até haver licença de webfont.

Os logótipos da UAb e da UTAD em `assets/` são **placeholders** — o manual da UAb estabelece explicitamente que a assinatura não pode ser redesenhada e só deve ser reproduzida a partir dos ficheiros oficiais fornecidos, pelo que não foram recriados aqui. Substituir:
- `assets/logo-uab-placeholder.svg` pelo ficheiro oficial da UAb
- `assets/logo-utad-placeholder.svg` pelo ficheiro oficial da UTAD

mantendo os nomes de ficheiro (ou atualizando as referências em cada `.html`).
A versão a cores da assinatura só deve ser aplicada sobre fundo branco — por isso o cabeçalho e o rodapé têm fundo branco fixo, independentemente do resto da página.

## Estado do conteúdo

Os blocos marcados como *"conteúdo a integrar"* na Matriz (Instrumento 2) eem três das Fichas de Decisão (Instrumento 3) aguardam confirmação do texto exato contra o Apêndice de Instrumentos da dissertação, para preservar a regra de não incluir conteúdo não verificado.

## Licença

Distribuído sob licença MIT — ver [LICENSE](LICENSE). Se reutilizar este artefacto, agradece-se a citação da dissertação de origem.