#!/usr/bin/env node
/**
 * gerar-questionario-estatico.js — produz estatico/questionario-estatico.html,
 * a transcrição linear de todo o percurso PME num único documento A4,
 * pronto a imprimir para PDF.
 *
 * Existe por uma razão concreta: o ponto 2.1 dos procedimentos da Comissão
 * de Ética da UAb exige que um questionário online seja submetido também em
 * PDF. Capturas de ecrã não servem — são dezenas de imagens, ilegíveis em
 * sequência e impossíveis de manter sincronizadas com a ferramenta.
 *
 * O documento é GERADO a partir das mesmas fontes que alimentam o site
 * (js/i18n.js e js/pme.js), e não escrito à mão. Assim, sempre que uma
 * pergunta ou o texto de consentimento mudar, basta voltar a correr este
 * script para o anexo da Comissão voltar a corresponder ao que está online.
 *
 * Uso:  node scripts/gerar-questionario-estatico.js
 * Depois: abrir estatico/questionario-estatico.html no navegador e
 *         Imprimir → Guardar como PDF (A4, margens predefinidas).
 */

const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const SAIDA = path.join(RAIZ, 'estatico', 'questionario-estatico.html');
const URL_FERRAMENTA = 'https://ricarduz.github.io/llm-bmc-pme/';

/** Extrai uma declaração `const NOME = ...;` de um ficheiro e avalia-a isoladamente.
 *  Preciso disto porque i18n.js e pme.js tocam no DOM no fim — avaliá-los
 *  inteiros em Node rebentava. Assim, corta-se só o bloco de dados. */
function extrair(ficheiro, nome, fecho) {
  const fonte = fs.readFileSync(path.join(RAIZ, ficheiro), 'utf8');
  const inicio = fonte.indexOf(`const ${nome} = `);
  if (inicio === -1) throw new Error(`${nome} não encontrado em ${ficheiro}`);
  const fim = fonte.indexOf(fecho, inicio);
  if (fim === -1) throw new Error(`fecho de ${nome} não encontrado em ${ficheiro}`);
  const bloco = fonte.slice(inicio, fim + fecho.length);
  return eval(`(function(){ ${bloco} return ${nome}; })()`);
}

const TRADUCOES = extrair('js/i18n.js', 'TRADUCOES', '\n};\n');
const PERGUNTAS = extrair('js/pme.js', 'PERGUNTAS', '\n];\n');
const BMC_BLOCOS = extrair('js/data.js', 'BMC_BLOCOS', '\n];\n');

const pt = TRADUCOES.pt;
const t = chave => pt[chave] || `⟨${chave}⟩`;
const nomeBloco = id => (BMC_BLOCOS.find(b => b.id === id) || {}).nome || id;

// Listas que vivem em pme.js dentro das funções de render — replicadas aqui
// pela mesma ordem em que aparecem ao participante. Se mudarem lá, mudar aqui.
const SETORES = ['comercio', 'servicos', 'industria', 'construcao', 'tecnologia', 'turismo', 'agricultura', 'saude', 'educacao', 'outro'];
const ESCALOES = ['micro', 'pequena', 'media', 'grande'];
const REGIOES = ['norte', 'centro', 'lisboa', 'alentejo', 'algarve', 'acores', 'madeira'];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** Igual a esc(), mas deixa passar o HTML das chaves de i18n que o usam de propósito (<strong>, <a>). */
const html = s => String(s);

const opcoes = lista => `<ol class="opcoes">${lista.map(o => `<li>${esc(o)}</li>`).join('')}</ol>`;
const meta = txt => `<p class="meta">${esc(txt)}</p>`;

const dataGeracao = new Date().toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric' });

// ---------------------------------------------------------------- secções

const secaoConsentimento = `
<section>
  <h2>A. Introdução e consentimento informado</h2>
  ${meta('Ecrã de entrada da ferramenta. O questionário só fica acessível depois de o participante validar a declaração de aceitação no fim desta secção — o botão de início permanece inativo até lá.')}
  <p class="eyebrow">${esc(t('pme-eyebrow'))}</p>
  <h3>${esc(t('pme-h1'))}</h3>
  <p>${esc(t('pme-lead'))}</p>
  <p class="destaque">${esc(t('pme-tempo'))} &nbsp;·&nbsp; ${esc(t('pme-areas'))}</p>
  <p>${esc(t('pme-sem-julgamento'))}</p>

  <div class="caixa">
    <h4>${esc(t('pme-antes-titulo'))}</h4>
    ${['quem', 'porque', 'perguntas', 'voluntaria', 'dados', 'riscos', 'divulgacao']
      .map(k => `<p>${html(t('pme-antes-' + k))}</p>`).join('\n    ')}
    <p>${esc(t('pme-antes-link'))} <span class="meta-inline">(assets/consentimento-pme.pdf)</span></p>
  </div>

  <div class="caixa caixa--consentimento">
    <p class="checkbox">☐ ${esc(t('pme-consentimento'))}</p>
    <p class="nota">${esc(t('pme-nota-navegador'))}</p>
  </div>
</section>`;

const secaoPerfil = `
<section>
  <h2>B. Caracterização da empresa</h2>
  ${meta('Quatro ecrãs consecutivos, um por pergunta. Nenhuma destas questões identifica a empresa ou o respondente.')}

  <div class="pergunta">
    <h4>B1. ${esc(t('pme-setor-pergunta'))}</h4>
    ${opcoes(SETORES.map(s => t('perfil-setor-' + s)))}
  </div>

  <div class="pergunta">
    <h4>B2. ${esc(t('pme-colaboradores-pergunta'))}</h4>
    <p class="campo">Campo numérico (número inteiro, mínimo 0)</p>
  </div>

  <div class="pergunta">
    <h4>B3. ${esc(t('pme-faturacao-pergunta'))}</h4>
    ${opcoes(ESCALOES.map(e => t('perfil-escalao-' + e + (e === 'media' || e === 'grande' ? '-volume' : ''))))}
  </div>

  <div class="pergunta">
    <h4>B4. ${esc(t('pme-localizacao-pergunta'))}</h4>
    <p class="campo">Lista pendente: ${esc(t('perfil-pais-pt'))} · ${esc(t('perfil-pais-europa'))}</p>
    <p class="campo">Se escolher ${esc(t('perfil-pais-pt'))}, segunda lista pendente — ${esc(t('pme-regiao-placeholder'))}: ${REGIOES.map(r => esc(t('perfil-regiao-' + r))).join(' · ')}</p>
  </div>

  <div class="caixa caixa--aviso">
    <h4>${esc(t('pme-bloqueio-titulo'))}</h4>
    <p>${esc(t('pme-bloqueio-texto'))}</p>
    ${meta('Ecrã de exclusão automática: empresas acima dos limiares de PME da Recomendação 2003/361/CE não prosseguem para o diagnóstico e nenhum dado de diagnóstico é recolhido.')}
  </div>
</section>`;

const secaoDiagnostico = `
<section>
  <h2>C. Diagnóstico organizacional</h2>
  ${meta('Dezoito perguntas fechadas, apresentadas uma por ecrã, sempre pela mesma ordem, com três opções de resposta mutuamente exclusivas. O bloco do Business Model Canvas e o eixo indicados à direita são metadados de análise — não são visíveis ao participante.')}
  ${PERGUNTAS.map((p, i) => `
  <div class="pergunta">
    <h4>C${i + 1}. ${esc(p.pergunta)}</h4>
    <p class="tag">${esc(nomeBloco(p.bloco))} · ${p.eixo === 'prontidao' ? 'prontidão' : 'impacto'}</p>
    ${opcoes(p.opcoes)}
  </div>`).join('')}
</section>`;

const secaoFinal = `
<section>
  <h2>D. Questões finais de perceção</h2>
  ${meta('Apresentadas depois do diagnóstico e antes de o relatório ser mostrado. Resposta binária.')}
  <div class="pergunta">
    <h4>D1. ${esc(t('pme-satisfacao-percebeu'))}</h4>
    ${opcoes([t('sim'), t('nao')])}
  </div>
  <div class="pergunta">
    <h4>D2. ${esc(t('pme-satisfacao-util'))}</h4>
    ${opcoes([t('sim'), t('nao')])}
  </div>
</section>

<section>
  <h2>E. Contacto facultativo</h2>
  ${meta('Ecrã final, depois do relatório. O preenchimento é opcional e a recusa não tem qualquer consequência — a alternativa está disponível no mesmo ecrã. O endereço é gravado em registo separado, sem ligação às respostas do diagnóstico.')}
  <div class="pergunta">
    <p class="campo">Campo de correio eletrónico (facultativo)</p>
    <p class="checkbox">☐ ${esc(t('pme-email-consentimento'))}</p>
    <p class="campo">Opções: «${esc(t('pme-email-sim'))}» · «${esc(t('pme-email-nao'))}»</p>
  </div>
</section>`;

// ---------------------------------------------------------------- documento

const documento = `<!DOCTYPE html>
<html lang="pt-PT">
<head>
<meta charset="UTF-8">
<title>Questionário a gestores de PME — transcrição integral</title>
<style>
  @page { size: A4; margin: 20mm 18mm; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; font-size: 10.5pt; line-height: 1.5; color: #111; max-width: 700px; margin: 0 auto; padding: 24px; background: #fff; }
  header.capa { border-bottom: 2px solid #111; padding-bottom: 16px; margin-bottom: 28px; }
  header.capa h1 { font-size: 16pt; margin: 0 0 6px; }
  header.capa p { margin: 3px 0; font-size: 9.5pt; }
  h2 { font-size: 12pt; border-bottom: 1px solid #111; padding-bottom: 4px; margin: 26px 0 12px; page-break-after: avoid; }
  h3 { font-size: 13pt; margin: 6px 0 10px; }
  h4 { font-size: 10.5pt; margin: 0 0 6px; page-break-after: avoid; }
  p { margin: 0 0 8px; }
  .eyebrow { font-size: 8pt; letter-spacing: 0.08em; text-transform: uppercase; color: #555; margin-bottom: 2px; }
  .destaque { font-weight: bold; }
  .caixa { border: 1px solid #999; padding: 12px 14px; margin: 12px 0 16px; page-break-inside: avoid; }
  .caixa--consentimento { border: 2px solid #111; }
  .caixa--aviso { border-style: dashed; }
  .pergunta { margin: 0 0 14px; padding-bottom: 10px; border-bottom: 1px dotted #bbb; page-break-inside: avoid; }
  .opcoes { margin: 4px 0 0 18px; padding: 0; }
  .opcoes li { margin: 2px 0; }
  .campo { font-style: italic; color: #333; }
  .checkbox { font-weight: bold; }
  .tag { font-size: 8pt; color: #666; text-transform: uppercase; letter-spacing: 0.04em; margin: 0 0 4px; }
  .meta, .meta-inline { font-size: 8.5pt; color: #555; font-style: italic; }
  .meta { border-left: 2px solid #ccc; padding-left: 8px; margin: 0 0 12px; }
  .nota { font-size: 9pt; color: #444; }
  a { color: #111; }
  footer { margin-top: 28px; border-top: 1px solid #999; padding-top: 10px; font-size: 8.5pt; color: #555; }
  @media print { body { padding: 0; } .meta { break-inside: avoid; } }
</style>
</head>
<body>

<header class="capa">
  <h1>Questionário a gestores de PME — transcrição integral</h1>
  <p><strong>Investigação:</strong> «Adoção de <em>Large Language Models</em> por Pequenas e Médias Empresas: Desafios e Oportunidades»</p>
  <p><strong>Investigador:</strong> Ricardo Filipe Isaías da Silva Serafim, n.º 2302605 — Mestrado em Engenharia Informática e Tecnologia Web (Universidade Aberta / UTAD)</p>
  <p><strong>Instrumento online:</strong> <a href="${URL_FERRAMENTA}">${URL_FERRAMENTA}</a></p>
  <p><strong>Documento gerado em:</strong> ${dataGeracao}</p>
</header>

<p class="meta">Este documento reproduz, em sequência linear, a totalidade do percurso do questionário online — ecrã de entrada e consentimento, caracterização da empresa, dezoito perguntas de diagnóstico, questões finais de perceção e pedido facultativo de contacto. É gerado automaticamente a partir do código-fonte da ferramenta, pelo que o seu conteúdo corresponde ao que o participante vê. Na ferramenta, cada pergunta é apresentada num ecrã próprio, com barra de progresso; aqui aparecem em sucessão, para leitura contínua.</p>

${secaoConsentimento}
${secaoPerfil}
${secaoDiagnostico}
${secaoFinal}

<footer>
  Gerado por <code>scripts/gerar-questionario-estatico.js</code> a partir de <code>js/i18n.js</code>, <code>js/pme.js</code> e <code>js/data.js</code>. Versão portuguesa; a ferramenta dispõe de versão inglesa com a mesma estrutura e conteúdo equivalente.
</footer>

</body>
</html>`;

fs.mkdirSync(path.dirname(SAIDA), { recursive: true });
fs.writeFileSync(SAIDA, documento, 'utf8');
console.log(`Gerado: ${path.relative(RAIZ, SAIDA)}`);
console.log(`  ${PERGUNTAS.length} perguntas de diagnóstico, ${SETORES.length} setores, ${ESCALOES.length} escalões, ${REGIOES.length} regiões`);
