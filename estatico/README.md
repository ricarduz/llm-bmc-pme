# estatico/

Versões estáticas de leitura, geradas a partir do conteúdo real do site (`js/data.js`, `js/i18n.js` e `js/pme.js`) — sem depender de JavaScript no navegador para apresentar o conteúdo. Servem para leitura contínua, submissão à Comissão de Ética e anexo à dissertação.

- `index-estatico.html` — visão geral do framework: os 9 blocos do BMC por área, os 3 instrumentos explicados, os dois percursos (PME e painel de especialistas) e um exemplo ilustrativo de um diagnóstico completo (canvas + tabela de prioridades calculada com `classificarBloco()`).
- `resultados-estatico.html` — o instrumento de avaliação preenchido pelos especialistas do painel (os 4 critérios DSRM + reflexão livre), em branco.
- `questionario-estatico.html` — transcrição linear integral do percurso PME num único documento A4 pronto a imprimir para PDF, gerada automaticamente por `scripts/gerar-questionario-estatico.js`.
- `guiao-especialistas-estatico.html` — transcrição linear integral do percurso e guião de entrevista do painel de especialistas (com distinção dos estratos E1, E2 e E3), gerada automaticamente por `scripts/gerar-guiao-especialistas.js`.

O conteúdo detalhado de cada um dos 3 instrumentos (Diagnóstico de Pré-requisitos, Matriz LLM × BMC, Fichas de Decisão) encontra-se em `assets/instrumento1.pdf`, `instrumento2.pdf` e `instrumento3.pdf`.

Cada ficheiro HTML nesta pasta é autónomo (CSS embutido) e depende apenas dos logótipos institucionais em `../assets/`.
