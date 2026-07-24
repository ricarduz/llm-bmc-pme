# estatico/

⚠ **Os 5 ficheiros abaixo estão desatualizados.** Foram gerados antes
da separação do site em dois percursos (PME e painel de
especialistas) e descrevem a estrutura ANTIGA — um só `index.html`
com o perfil da empresa, a grelha do BMC e os 3 instrumentos todos
juntos numa página. Essa estrutura já não existe: hoje o site tem
`index.html` (só a bifurcação), `pme.html` (o jogo + relatório),
`entrevista.html` + `cenario.html` (apresentação do protocolo e
escolha de cenário) e só depois os instrumentos.

O propósito da pasta mantém-se válido — instantâneos HTML
não-interativos, para leitura, partilha ou anexo à dissertação, sem
depender de JavaScript nem de um diagnóstico real preenchido. Só
precisam de ser regenerados para refletirem a estrutura atual.

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
