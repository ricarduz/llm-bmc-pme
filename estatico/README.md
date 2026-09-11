# estatico/

Versões estáticas de leitura, geradas a partir do conteúdo real do site
(`js/data.js`) — sem depender de JavaScript para mostrar o conteúdo.
Servem para leitura, partilha ou anexo à dissertação, onde uma
ferramenta interativa não é o formato adequado.

- `index-estatico.html` — visão geral do framework: os 9 blocos do BMC
  por área, os 3 instrumentos explicados, os dois percursos (PME e
  painel de especialistas), e um exemplo ilustrativo de um diagnóstico
  completo (canvas + tabela de prioridades, valores fictícios).
- `resultados-estatico.html` — o instrumento de avaliação preenchido
  pelos especialistas do painel (os 4 critérios DSR + reflexão livre),
  em branco — é o instrumento, não uma resposta preenchida.

O conteúdo detalhado de cada um dos 3 instrumentos (Diagnóstico de
Pré-requisitos, Matriz LLM × BMC, Fichas de Decisão) está em
`assets/instrumento1.pdf`, `instrumento2.pdf` e `instrumento3.pdf` —
não duplicado aqui, para não haver duas versões da mesma coisa a
poderem divergir.

**Não geradas automaticamente a partir do site** — se o conteúdo em
`js/data.js` mudar (textos, indicadores, fichas), estes ficheiros têm
de ser regenerados à parte; não se atualizam sozinhos. O exemplo
ilustrativo em `index-estatico.html` foi calculado com a função real
de classificação (`classificarBloco()`), não valores inventados à mão
— para nunca mostrar uma combinação Prontidão/Impacto/Prioridade que a
ferramenta real não produziria.

Cada ficheiro é autónomo (CSS embutido, à parte do `css/style.css` do
site) — só depende dos logótipos em `../assets/`. Sem seletor de
idioma (só em português) nem elementos interativos (formulários,
checkboxes e o mini-mapa do cabeçalho são só visuais, não funcionam).
