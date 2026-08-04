# apps-script/

Cópia de referência do código que corre do lado do Google (Apps Script
Web App, ligado a uma Google Sheet), para receber os dados enviados por
`js/resultados.js` quando `GOOGLE_SHEETS_URL` está configurado.

Este ficheiro **não corre a partir daqui** — o código que efetivamente
está ativo vive no editor Apps Script da própria Google Sheet
(Extensões → Apps Script). Esta cópia serve só para ter o script
versionado no repositório, tal como o resto do site, e não perder
alterações feitas ao longo do tempo.

**Sempre que editares o `Code.gs` na Google Sheet, atualiza também esta
cópia aqui** (e vice-versa) — e lembra-te que editar o script no Google
não republica sozinho: depois de qualquer alteração, é preciso
**Implementar → Gerir implementações → ✏️ → Versão: Nova versão →
Implementar**, ou o site continua a falar com a versão antiga.
