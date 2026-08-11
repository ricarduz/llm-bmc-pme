#!/usr/bin/env node
/**
 * gerar-guiao-especialistas.js — produz estatico/guiao-especialistas-estatico.html,
 * a transcrição linear do percurso do painel de especialistas num único
 * documento A4, pronto a imprimir para PDF.
 *
 * Companheiro de gerar-questionario-estatico.js: o ponto 3 dos procedimentos
 * da Comissão de Ética da UAb exige que o guião de entrevista seja precedido
 * de uma secção informativa sobre objetivos, procedimentos e consentimento.
 * Este documento junta as duas coisas num só ficheiro.
 *
 * Os três perfis do painel não veem exatamente o mesmo material — o estrato
 * académico recebe uma Síntese Teórica que os outros dois não recebem (ver
 * js/sessao.js). Em vez de gerar três documentos quase iguais, marca-se cada
 * secção com os perfis a que se aplica, e a secção diferenciada fica
 * visualmente destacada.
 *
 * Uso:  node scripts/gerar-guiao-especialistas.js
 * Depois: abrir o HTML no navegador e Imprimir → Guardar como PDF (A4).
 */

const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const SAIDA = path.join(RAIZ, 'estatico', 'guiao-especialistas-estatico.html');
const URL_FERRAMENTA = 'https://ricarduz.github.io/llm-bmc-pme/';

/** Ver nota em gerar-questionario-estatico.js: corta-se o bloco de dados em vez de avaliar o ficheiro inteiro, que toca no DOM. */
function extrair(ficheiro, nome, fecho) {
  const fonte = fs.readFileSync(path.join(RAIZ, ficheiro), 'utf8');
  const inicio = fonte.indexOf(`const ${nome} = `);
  if (inicio === -1) throw new Error(`${nome} não encontrado em ${ficheiro}`);
  const fim = fonte.indexOf(fecho, inicio);
  if (fim === -1) throw new Error(`fecho de ${nome} não encontrado em ${ficheiro}`);
  return eval(`(function(){ ${fonte.slice(inicio, fim + fecho.length)} return ${nome}; })()`);
}

const TRADUCOES = extrair('js/i18n.js', 'TRADUCOES', '\n};\n');
const pt = TRADUCOES.pt;
const t = chave => pt[chave] || `⟨${chave}⟩`;

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const meta = txt => `<p class="meta">${esc(txt)}</p>`;

/** Selo de perfis aplicáveis. `ativos` é um subconjunto de ['E1','E2','E3']. */
function selo(ativos) {
  return `<p class="perfis">${['E1', 'E2', 'E3']
    .map(p => `<span class="badge ${ativos.includes(p) ? '' : 'badge--off'}">${p}</span>`).join('')}
    <span class="perfis-texto">${ativos.length === 3 ? 'todos os perfis' : 'apenas ' + ativos.join(' e ')}</span></p>`;
}

const TODOS = ['E1', 'E2', 'E3'];
const CRITERIOS = ['utilidade', 'aplicabilidade', 'consistencia', 'completude'];
const dataGeracao = new Date().toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric' });

// ---------------------------------------------------------------- secções

const secaoInformativa = `
<section>
  <h2>A. Secção informativa e consentimento</h2>
  ${selo(TODOS)}
  ${meta('Primeiro ecrã do percurso. O participante acede a esta página antes de qualquer contacto com o artefacto; a sessão só avança depois de escolhido o perfil e validada a autorização de participação.')}
  <p class="eyebrow">${esc(t('entrevista-eyebrow'))}</p>
  <h3>${esc(t('entrevista-h1'))}</h3>
  <p>${esc(t('entrevista-lead'))}</p>
  ${meta('Nesta página é também disponibilizado um vídeo de apresentação, com o mesmo conteúdo do texto abaixo.')}

  <div class="caixa">
    <h4>${esc(t('entrevista-fazer-titulo'))}</h4>
    <p>${esc(t('entrevista-fazer-texto-1'))}</p>
    <p>${esc(t('entrevista-fazer-texto-2'))}</p>
  </div>

  <div class="caixa">
    <h4>${esc(t('entrevista-antes-titulo'))}</h4>
    ${['quem', 'voluntaria', 'dados', 'riscos', 'divulgacao']
      .map(k => `<p>${t('entrevista-antes-' + k)}</p>`).join('\n    ')}
    <p>${esc(t('entrevista-antes-link'))} <span class="meta-inline">(assets/consentimento-especialistas.pdf)</span></p>
  </div>

  <div class="pergunta">
    <h4>A1. ${esc(t('entrevista-perfil-titulo'))}</h4>
    <p class="nota">${esc(t('entrevista-perfil-nota'))}</p>
    <ol class="opcoes">
      <li>${esc(t('entrevista-perfil-gestor'))} <span class="meta-inline">— estrato E1</span></li>
      <li>${esc(t('entrevista-perfil-ti'))} <span class="meta-inline">— estrato E2</span></li>
      <li>${esc(t('entrevista-perfil-academico'))} <span class="meta-inline">— estrato E3</span></li>
    </ol>
  </div>

  <div class="caixa caixa--consentimento">
    <p class="checkbox">☐ ${esc(t('entrevista-autorizacao'))}</p>
    ${meta('Obrigatória: sem esta validação, e sem perfil escolhido, o botão de continuação permanece inativo.')}
    <p class="checkbox">☐ ${esc(t('entrevista-autorizacao-audio'))}</p>
    ${meta('Facultativa e independente da anterior: quem não a valide participa na mesma, com registo escrito em vez de gravação.')}
  </div>
</section>`;

const secaoDocumentos = `
<section>
  <h2>B. Documentos da sessão</h2>
  ${meta('Segundo ecrã. É aqui que o material difere entre estratos.')}

  <div class="pergunta">
    <h4>B1. ${esc(t('sessao-nota-titulo'))}</h4>
    ${selo(TODOS)}
    <p class="nota">${esc(t('sessao-nota-desc'))}</p>
    <p class="campo">Documento em PDF, incorporado na página e disponível para abrir em separado <span class="meta-inline">(assets/nota-sessao-especialistas.pdf)</span></p>
  </div>

  <div class="pergunta destaque-e3">
    <h4>B2. ${esc(t('sessao-sintese-titulo'))}</h4>
    ${selo(['E3'])}
    <p class="nota">${esc(t('sessao-sintese-desc'))}</p>
    <p class="campo">Documento em PDF, incorporado na página e disponível para abrir em separado <span class="meta-inline">(assets/sintese-teorica-E3.pdf)</span></p>
    ${meta('Único material diferenciado de todo o percurso. É disponibilizado apenas ao estrato E3 porque o critério de consistência com a literatura, que só a este estrato se pede que avalie com profundidade, exige o enquadramento teórico do framework. Os estratos E1 e E2 não veem este documento nem são informados da sua existência durante a sessão. Todos os participantes acedem aos mesmos instrumentos do artefacto e respondem ao mesmo guião de avaliação.')}
  </div>
</section>`;

const secaoPercurso = `
<section>
  <h2>C. Percurso pelo artefacto</h2>
  ${selo(TODOS)}
  ${meta('Três ecrãs de apresentação e consulta, sem recolha de dados sobre o participante. Correspondem ao momento de apresentação do artefacto previsto no protocolo (cerca de 15 minutos).')}

  <div class="pergunta">
    <h4>C1. ${esc(t('materiais-h1'))}</h4>
    <p class="nota">${esc(t('materiais-lead'))}</p>
    <p class="campo">Separadores: ${esc(t('materiais-aba-1'))} · ${esc(t('materiais-aba-2'))} · ${esc(t('materiais-aba-3'))}, cada um com o respetivo PDF.</p>
  </div>

  <div class="pergunta">
    <h4>C2. ${esc(t('cenario-h1'))}</h4>
    <p class="nota">${esc(t('cenario-lead'))}</p>
    <p class="campo">Opções: «${esc(t('cenario-autonomo-titulo'))}» ou um de três cenários de PME pré-preenchidos.</p>
    <p class="nota">${esc(t('cenario-nota-rodape'))}</p>
    ${meta('Se o participante escolher um cenário pré-preenchido, as respostas do diagnóstico não lhe dizem respeito nem à sua organização — são dados fictícios de demonstração.')}
  </div>

  <div class="pergunta">
    <h4>C3. Instrumentos 1, 2 e 3</h4>
    <p class="campo">Percurso pelo Diagnóstico de Pré-requisitos, pela Matriz LLM × BMC e pelas Fichas de Decisão.</p>
    ${meta('Nenhum destes ecrãs recolhe dados pessoais. As respostas introduzidas dizem respeito a uma empresa hipotética ou ao cenário escolhido, e servem para o participante poder julgar o comportamento do artefacto.')}
  </div>
</section>`;

const secaoGuiao = `
<section>
  <h2>D. Guião de avaliação</h2>
  ${selo(TODOS)}
  ${meta('Ecrã final da sessão e único ponto de recolha de dados de investigação sobre o participante. Corresponde ao momento de entrevista semiestruturada do protocolo (cerca de 35 minutos). As quatro questões de escala são de resposta obrigatória para desbloquear o encerramento; os comentários são opcionais.')}
  <p>${esc(t('sintese-lead'))}</p>

  ${CRITERIOS.map((c, i) => `
  <div class="pergunta">
    <h4>D${i + 1}. ${esc(t('crit-' + c))}</h4>
    <p class="campo">Escala de 1 a 5 (resposta obrigatória) · 1 = discordo totalmente, 5 = concordo totalmente</p>
    <p class="escala">☐ 1 &nbsp; ☐ 2 &nbsp; ☐ 3 &nbsp; ☐ 4 &nbsp; ☐ 5</p>
    <p class="campo">Campo de texto livre — comentário (opcional)</p>
  </div>`).join('')}

  <div class="pergunta">
    <h4>D5. ${esc(t('sintese-reflexao-titulo'))}</h4>
    <p class="nota">${esc(t('sintese-reflexao-texto'))}</p>
    <p class="campo">Campo de texto livre (opcional)</p>
    ${meta('Corresponde ao momento de reflexão livre do protocolo (cerca de 10 minutos).')}
  </div>
</section>`;

const secaoFecho = `
<section>
  <h2>E. Contacto facultativo e encerramento</h2>
  ${selo(TODOS)}

  <div class="pergunta">
    <h4>E1. ${esc(t('sintese-email-titulo'))}</h4>
    <p class="nota">${esc(t('sintese-email-texto'))}</p>
    <p class="campo">${esc(t('sintese-email-label'))} — campo de correio eletrónico</p>
    <p class="checkbox">☐ ${esc(t('sintese-email-consentimento'))}</p>
    ${meta('O endereço só é registado se esta aceitação for validada: um campo preenchido sem aceitação é descartado. O endereço é gravado em registo separado, sem qualquer ligação ao registo da avaliação, e utilizado exclusivamente para envio das conclusões finais do estudo.')}
  </div>

  <div class="pergunta">
    <h4>E2. ${esc(t('sintese-download-titulo'))}</h4>
    <p class="nota">${esc(t('sintese-download-texto'))}</p>
  </div>

  <div class="caixa">
    <h4>${esc(t('sessao-terminada-titulo'))}</h4>
    <p class="nota">${esc(t('sessao-terminar-confirmar'))}</p>
    <p>${esc(t('sessao-terminada-agradecimento'))}</p>
    <p class="nota">${esc(t('sessao-terminada-texto'))}</p>
  </div>
</section>`;

// ---------------------------------------------------------------- documento

const documento = `<!DOCTYPE html>
<html lang="pt-PT">
<head>
<meta charset="UTF-8">
<title>Guião de entrevista ao painel de especialistas — transcrição integral</title>
<style>
  @page { size: A4; margin: 20mm 18mm; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; font-size: 10.5pt; line-height: 1.5; color: #111; max-width: 700px; margin: 0 auto; padding: 24px; background: #fff; }
  header.capa { border-bottom: 2px solid #111; padding-bottom: 16px; margin-bottom: 24px; }
  header.capa h1 { font-size: 16pt; margin: 0 0 6px; }
  header.capa p { margin: 3px 0; font-size: 9.5pt; }
  h2 { font-size: 12pt; border-bottom: 1px solid #111; padding-bottom: 4px; margin: 26px 0 10px; page-break-after: avoid; }
  h3 { font-size: 13pt; margin: 6px 0 10px; }
  h4 { font-size: 10.5pt; margin: 0 0 6px; page-break-after: avoid; }
  p { margin: 0 0 8px; }
  .eyebrow { font-size: 8pt; letter-spacing: 0.08em; text-transform: uppercase; color: #555; margin-bottom: 2px; }
  .caixa { border: 1px solid #999; padding: 12px 14px; margin: 12px 0 16px; page-break-inside: avoid; }
  .caixa--consentimento { border: 2px solid #111; }
  .legenda { border: 1px solid #111; padding: 12px 14px; margin: 0 0 20px; page-break-inside: avoid; }
  .legenda dl { margin: 6px 0 0; }
  .legenda dt { font-weight: bold; float: left; width: 34px; clear: left; }
  .legenda dd { margin: 0 0 3px 34px; }
  .pergunta { margin: 0 0 14px; padding-bottom: 10px; border-bottom: 1px dotted #bbb; page-break-inside: avoid; }
  .destaque-e3 { border: 2px solid #111; border-bottom-style: solid; padding: 12px 14px; background: #f4f4f4; }
  .opcoes { margin: 4px 0 0 18px; padding: 0; }
  .opcoes li { margin: 2px 0; }
  .campo { font-style: italic; color: #333; }
  .checkbox { font-weight: bold; margin-bottom: 4px; }
  .escala { font-size: 11pt; letter-spacing: 0.04em; margin: 4px 0 6px; }
  .perfis { margin: 0 0 8px; font-size: 8pt; }
  .badge { display: inline-block; border: 1px solid #111; padding: 0 5px; margin-right: 3px; font-weight: bold; font-size: 8pt; font-family: Arial, sans-serif; }
  .badge--off { border-color: #ccc; color: #ccc; }
  .perfis-texto { color: #555; font-style: italic; margin-left: 4px; }
  .meta, .meta-inline { font-size: 8.5pt; color: #555; font-style: italic; }
  .meta { border-left: 2px solid #ccc; padding-left: 8px; margin: 0 0 12px; }
  .nota { font-size: 9pt; color: #444; }
  a { color: #111; }
  footer { margin-top: 28px; border-top: 1px solid #999; padding-top: 10px; font-size: 8.5pt; color: #555; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>

<header class="capa">
  <h1>Guião de entrevista ao painel de especialistas — transcrição integral</h1>
  <p><strong>Investigação:</strong> «Adoção de <em>Large Language Models</em> por Pequenas e Médias Empresas: Desafios e Oportunidades»</p>
  <p><strong>Investigador:</strong> Ricardo Filipe Isaías da Silva Serafim, n.º 2302605 — Mestrado em Engenharia Informática e Tecnologia Web (Universidade Aberta / UTAD)</p>
  <p><strong>Instrumento online:</strong> <a href="${URL_FERRAMENTA}">${URL_FERRAMENTA}</a></p>
  <p><strong>Documento gerado em:</strong> ${dataGeracao}</p>
</header>

<p class="meta">Este documento reproduz, em sequência linear, a totalidade do percurso do painel de especialistas — secção informativa e consentimento, documentos da sessão, percurso pelo artefacto, guião de avaliação e encerramento. É gerado automaticamente a partir do código-fonte da ferramenta, pelo que o seu conteúdo corresponde ao que o participante vê. A sessão é conduzida pelo investigador, em videoconferência ou presencialmente, com a duração aproximada de 60 minutos.</p>

<div class="legenda">
  <h4>Perfis do painel e leitura dos selos</h4>
  <dl>
    <dt>E1</dt><dd>${esc(t('entrevista-perfil-gestor'))}</dd>
    <dt>E2</dt><dd>${esc(t('entrevista-perfil-ti'))}</dd>
    <dt>E3</dt><dd>${esc(t('entrevista-perfil-academico'))}</dd>
  </dl>
  <p class="nota" style="margin-top:8px;">Cada secção é marcada com os perfis a que se aplica. Selo a cheio significa que a secção é apresentada a esse perfil; selo esbatido significa que não é. Uma única secção deste percurso é diferenciada — a Síntese Teórica (B2), disponibilizada apenas ao estrato E3 e assinalada com moldura destacada. Tudo o resto é comum aos três estratos.</p>
</div>

${secaoInformativa}
${secaoDocumentos}
${secaoPercurso}
${secaoGuiao}
${secaoFecho}

<footer>
  Gerado por <code>scripts/gerar-guiao-especialistas.js</code> a partir de <code>js/i18n.js</code>. Versão portuguesa; a ferramenta dispõe de versão inglesa com a mesma estrutura e conteúdo equivalente.
</footer>

</body>
</html>`;

fs.mkdirSync(path.dirname(SAIDA), { recursive: true });
fs.writeFileSync(SAIDA, documento, 'utf8');
console.log(`Gerado: ${path.relative(RAIZ, SAIDA)}`);
console.log(`  ${CRITERIOS.length} critérios de avaliação + reflexão livre; 1 secção diferenciada (E3)`);
