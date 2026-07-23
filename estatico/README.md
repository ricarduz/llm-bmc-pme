# estatico/

Versões estáticas das 5 páginas do site, geradas a partir do conteúdo
real (`js/data.js`) — sem depender de JavaScript para mostrar o
conteúdo. Servem para leitura, partilha ou anexo (ex: dissertação),
onde uma ferramenta interativa não é o formato adequado.

- `index-estatico.html` — perfil, grelha do BMC, os 3 instrumentos
- `instrumento1-estatico.html` — os 9 blocos, todos abertos (Prontidão/Impacto)
- `instrumento2-estatico.html` — os 9 blocos, com a Matriz completa
- `instrumento3-estatico.html` — as 4 Fichas de Decisão, empilhadas
- `resultados-estatico.html` — **com dados de exemplo**, claramente identificados como ilustrativos (a página não faz sentido vazia, por depender de um diagnóstico real)

**Não geradas automaticamente a partir do site** — se o conteúdo em
`js/data.js` mudar (textos, indicadores, fichas), estes ficheiros têm
de ser regenerados à parte; não se atualizam sozinhos.

Cada ficheiro é autónomo (CSS embutido, à parte do `css/style.css` do
site) — só depende dos logótipos em `../assets/`. Sem seletor de
idioma (só em português) nem elementos interativos (formulários,
checkboxes e o mini-mapa do cabeçalho são só visuais, não funcionam).
