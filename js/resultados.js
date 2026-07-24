const estadoR = lerEstado();

/**
 * Integração opcional com Google Sheets (Apps Script Web App).
 * Deixa GOOGLE_SHEETS_URL vazio para desativar o envio automático — a
 * exportação e o contacto por email continuam a funcionar localmente.
 * Preencher com o URL de implementação do Apps Script quando estiver
 * pronto (o payload inclui "tipo": "diagnostico" ou "contacto", para
 * encaminhar para folhas diferentes).
 */
const GOOGLE_SHEETS_URL = '';

function enviarParaGoogleSheets(payload) {
  if (!GOOGLE_SHEETS_URL) return;
  fetch(GOOGLE_SHEETS_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload)
  }).catch(e => console.error('Envio para a folha de cálculo falhou:', e));
}

function imagemParaDataURLViaCanvas(caminho) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext('2d').drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg'));
      } catch (e) {
        console.error(`Canvas não conseguiu converter ${caminho}:`, e);
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = caminho;
  });
}

async function imagemParaDataURL(caminho) {
  try {
    const resposta = await fetch(caminho);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const blob = await resposta.blob();
    return await new Promise((resolve, reject) => {
      const leitor = new FileReader();
      leitor.onload = () => resolve(leitor.result);
      leitor.onerror = reject;
      leitor.readAsDataURL(blob);
    });
  } catch (e) {
    // fetch() é bloqueado em páginas abertas via file:// — tenta via <canvas>
    return await imagemParaDataURLViaCanvas(caminho);
  }
}

function renderTabela() {
  const linhas = BMC_BLOCOS
    .filter(b => estadoR.diagnostico[b.id])
    .map(b => {
      const r = estadoR.diagnostico[b.id];
      return `
        <tr>
          <td>${tBloco(b).nome}</td>
          <td>${r.prontidao}</td>
          <td>${r.impacto}</td>
          <td><span class="selo" data-p="${r.prioridade}">${tPrioridade(r.prioridade)}</span></td>
        </tr>`;
    }).join('');

  document.getElementById('tabela-diagnostico').innerHTML = `
    <thead><tr><th>${t('th-bloco')}</th><th>${t('th-prontidao')}</th><th>${t('th-impacto')}</th><th>${t('th-prioridade')}</th></tr></thead>
    <tbody>${linhas || `<tr><td colspan="4" class="nota">${t('sintese-nenhum-avaliado')}</td></tr>`}</tbody>
  `;
}

function listaMatriz(itens) {
  return `<ul style="margin:0; padding-left:18px;">${itens.map(i => `<li>${i}</li>`).join('')}</ul>`;
}

function renderFichaResumo(bloco, ficha) {
  return `
    <div style="margin-bottom:24px; padding-bottom:24px; border-bottom:1px solid var(--line);">
      <h4 style="margin-bottom:4px;">${tBloco(bloco).nome} — ${t('ficha-titulo-sufixo')}</h4>
      <p class="nota" style="margin-bottom:14px;">${ficha.area} · ${ficha.requisitos}</p>

      <p><strong>${t('ficha-contexto')}:</strong> ${ficha.contexto}</p>

      <p style="margin-bottom:6px;"><strong>${t('ficha-aplicacoes')}:</strong></p>
      ${listaMatriz(ficha.aplicacoes)}

      <p style="margin:14px 0 6px;"><strong>${t('ficha-tecnologia')}:</strong></p>
      <table>
        <thead><tr><th>${t('th-opcao')}</th><th>${t('th-adequada-quando')}</th><th>${t('th-consideracoes')}</th></tr></thead>
        <tbody>
          ${ficha.orientacaoTecnologica.map(o => `<tr><td>${o.opcao}</td><td>${o.quando}</td><td>${o.consideracoes}</td></tr>`).join('')}
        </tbody>
      </table>

      <p style="margin:14px 0 6px;"><strong>${t('ficha-acoes')}:</strong></p>
      ${listaMatriz(ficha.acoes)}

      <p style="margin:14px 0 6px;"><strong>${t('ficha-criterios')}:</strong></p>
      <table>
        <thead><tr><th>${t('th-criterio')}</th><th>${t('th-indicador')}</th></tr></thead>
        <tbody>
          ${ficha.criterios.map(c => `<tr><td>${c.criterio}</td><td>${c.indicador}</td></tr>`).join('')}
        </tbody>
      </table>

      <p style="margin-top:14px;"><strong>${t('ficha-governanca')}:</strong> ${ficha.governanca}</p>
    </div>`;
}

function renderAprofundados() {
  const el = document.getElementById('blocos-aprofundados');
  if (estadoR.blocosSelecionados.length === 0) {
    el.innerHTML = `<p class="nota">${t('sintese-nenhum-bloco')}</p>`;
    return;
  }
  el.innerHTML = estadoR.blocosSelecionados.map(id => {
    const bloco = BMC_BLOCOS.find(b => b.id === id);
    const ficha = FICHAS[id];
    if (!bloco || !ficha) return '';
    return renderFichaResumo(bloco, ficha);
  }).join('');
}

function atualizarMapa() {
  const celulas = document.querySelectorAll('#mapa i');
  BMC_BLOCOS.forEach((bloco, idx) => {
    const resultado = estadoR.diagnostico[bloco.id];
    if (resultado && celulas[idx]) {
      celulas[idx].classList.add('preenchido');
      celulas[idx].setAttribute('data-p', resultado.prioridade);
    }
  });
}

function irParaAba(aba) {
  document.getElementById('aba-descarregar').hidden = aba !== 'descarregar';
  document.getElementById('aba-resultado').hidden = aba !== 'resultado';
  document.querySelectorAll('.aba-painel').forEach(botao => {
    botao.classList.toggle('ativa', botao.dataset.aba === aba);
  });
}

document.querySelectorAll('.aba-painel').forEach(botao => {
  botao.addEventListener('click', () => irParaAba(botao.dataset.aba));
});

function irParaPasso(n) {
  [1, 2].forEach(i => {
    document.getElementById(`r-passo-${i}`).hidden = i !== n;
    const dot = document.getElementById(`passo-dot-${i}`);
    dot.classList.toggle('ativo', i === n);
    dot.classList.toggle('concluido', i < n);
  });
  if (n === 2) irParaAba('descarregar');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function configurarLinkVoltarInstrumento() {
  const temFicha = estadoR.blocosSelecionados.some(id => BMC_BLOCOS.find(b => b.id === id)?.ficha);
  document.getElementById('voltar-instrumento').setAttribute('href', temFicha ? 'instrumento3.html' : 'instrumento2.html');
}

function validarSatisfacao() {
  const percebeu = document.querySelector('input[name="satisfacao-percebeu"]:checked');
  const util = document.querySelector('input[name="satisfacao-util"]:checked');
  document.getElementById('ir-passo-2').disabled = !(percebeu && util);
  return { percebeu, util };
}

function guardarSatisfacao() {
  const { percebeu, util } = validarSatisfacao();
  if (!percebeu || !util) return;
  const estadoAtual = lerEstado();
  estadoAtual.satisfacao = { percebeu: percebeu.value, util: util.value };
  guardarEstado(estadoAtual);
}

function restaurarSatisfacao() {
  const satisfacao = estadoR.satisfacao;
  if (!satisfacao) return;
  if (satisfacao.percebeu) {
    const el = document.querySelector(`input[name="satisfacao-percebeu"][value="${satisfacao.percebeu}"]`);
    if (el) el.checked = true;
  }
  if (satisfacao.util) {
    const el = document.querySelector(`input[name="satisfacao-util"][value="${satisfacao.util}"]`);
    if (el) el.checked = true;
  }
  validarSatisfacao();
}

document.querySelectorAll('input[name="satisfacao-percebeu"], input[name="satisfacao-util"]').forEach(input => {
  input.addEventListener('change', () => { validarSatisfacao(); guardarSatisfacao(); });
});

document.getElementById('ir-passo-2').addEventListener('click', () => irParaPasso(2));
document.getElementById('voltar-passo-1').addEventListener('click', () => irParaPasso(1));

function construirRegisto() {
  return {
    tipo: 'diagnostico',
    concluidoEm: new Date().toISOString(),
    perfilEmpresa: estadoR.perfilEmpresa,
    satisfacao: estadoR.satisfacao,
    diagnostico: estadoR.diagnostico,
    blocosSelecionados: estadoR.blocosSelecionados
  };
}

function descarregarFicheiro(conteudo, nomeFicheiro, tipoMime) {
  const blob = new Blob([conteudo], { type: tipoMime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nomeFicheiro;
  a.click();
  URL.revokeObjectURL(url);
}

function rotuloEscalao(criterio, escalao) {
  if (escalao === 'media' || escalao === 'grande') return t(`perfil-escalao-${escalao}-${criterio}`);
  return t(`perfil-escalao-${escalao}`);
}

function classificacaoSME(colaboradores, escalao) {
  const ordem = ['micro', 'pequena', 'media', 'grande'];
  const tierStaff = colaboradores < 10 ? 'micro' : colaboradores < 50 ? 'pequena' : colaboradores < 250 ? 'media' : 'grande';
  return ordem[Math.max(ordem.indexOf(tierStaff), ordem.indexOf(escalao))];
}

async function construirResumoHTML() {
  const perfil = estadoR.perfilEmpresa || {};
  const idioma = obterIdioma();
  const dataGeracao = new Date().toLocaleDateString(idioma === 'pt' ? 'pt-PT' : 'en-GB');

  const [logoUab, logoUtad] = await Promise.all([
    imagemParaDataURL('assets/logo-uab-placeholder.jpeg'),
    imagemParaDataURL('assets/logo-utad-placeholder.jpeg')
  ]);

  const linhasDiagnostico = BMC_BLOCOS
    .filter(b => estadoR.diagnostico[b.id])
    .map(b => {
      const r = estadoR.diagnostico[b.id];
      return `<tr><td>${tBloco(b).nome}</td><td>${r.prontidao}</td><td>${r.impacto}</td><td>${tPrioridade(r.prioridade)}</td></tr>`;
    }).join('');

  const listaAprofundados = estadoR.blocosSelecionados.length
    ? estadoR.blocosSelecionados.map(id => {
        const bloco = BMC_BLOCOS.find(b => b.id === id);
        const ficha = FICHAS[id];
        if (!bloco || !ficha) return '';
        const linha = (rotulo, itens) => `<tr><th>${rotulo}</th><td><ul style="margin:0; padding-left:18px;">${itens.map(i => `<li>${i}</li>`).join('')}</ul></td></tr>`;
        return `
          <h3>${tBloco(bloco).nome} — ${t('ficha-titulo-sufixo')}</h3>
          <p><em>${ficha.area} · ${ficha.requisitos}</em></p>
          <p><strong>${t('ficha-contexto')}:</strong> ${ficha.contexto}</p>
          <table>${linha(t('ficha-aplicacoes'), ficha.aplicacoes)}</table>
          <table>
            <thead><tr><th>${t('th-opcao')}</th><th>${t('th-adequada-quando')}</th><th>${t('th-consideracoes')}</th></tr></thead>
            <tbody>${ficha.orientacaoTecnologica.map(o => `<tr><td>${o.opcao}</td><td>${o.quando}</td><td>${o.consideracoes}</td></tr>`).join('')}</tbody>
          </table>
          <table>${linha(t('ficha-acoes'), ficha.acoes)}</table>
          <table>
            <thead><tr><th>${t('th-criterio')}</th><th>${t('th-indicador')}</th></tr></thead>
            <tbody>${ficha.criterios.map(c => `<tr><td>${c.criterio}</td><td>${c.indicador}</td></tr>`).join('')}</tbody>
          </table>
          <p><strong>${t('ficha-governanca')}:</strong> ${ficha.governanca}</p>`;
      }).join('<hr style="margin:24px 0; border:none; border-top:1px solid #DADDD9;">')
    : `<p>${t('sintese-nenhum-bloco')}</p>`;

  const blocoPerfil = perfil.setor ? `
    <h2>${t('passo1-titulo')}</h2>
    <table>
      <tr><th>${t('perfil-setor-label')}</th><td>${t('perfil-setor-' + perfil.setor)}</td></tr>
      <tr><th>${t('perfil-colaboradores-label')}</th><td>${perfil.colaboradores}</td></tr>
      <tr><th>${t('perfil-faturacao-label')}</th><td>${rotuloEscalao(perfil.criterioFinanceiro, perfil.escalaoFinanceiro)}</td></tr>
      <tr><th>${t('classificacao-label')}</th><td>${t('classificacao-valor-' + classificacaoSME(perfil.colaboradores, perfil.escalaoFinanceiro))}</td></tr>
      <tr><th>${t('perfil-pais-label')}</th><td>${perfil.pais === 'pt' ? `${t('perfil-pais-pt')}${perfil.regiao ? ' — ' + t('perfil-regiao-' + perfil.regiao) : ''}` : t('perfil-pais-europa')}</td></tr>
    </table>
  ` : '';

  return `<!DOCTYPE html>
<html lang="${idioma === 'pt' ? 'pt-PT' : 'en'}">
<head>
<meta charset="UTF-8">
<title>LLM em PME — ${t('sintese-h1')}</title>
<style>
  body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; max-width: 720px; margin: 40px auto; padding: 0 24px; color: #16191B; line-height: 1.5; }
  h1 { font-size: 1.6rem; margin-bottom: 4px; }
  h2 { font-size: 1.1rem; margin-top: 32px; border-bottom: 2px solid #6D8297; padding-bottom: 6px; }
  .data { color: #52585C; font-size: 0.9rem; margin-bottom: 24px; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #DADDD9; font-size: 0.92rem; }
  th { color: #52585C; font-weight: 600; }
  footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid #DADDD9; }
  footer .logos { display: flex; align-items: center; gap: 24px; margin-bottom: 12px; }
  footer .logos img { height: 40px; width: auto; display: block; }
  footer p { font-size: 0.8rem; color: #52585C; margin: 0; }
  @media print { body { margin: 0; } }
</style>
</head>
<body>
  <h1>LLM em PME — ${t('sintese-h1')}</h1>
  <p class="data">${dataGeracao}</p>

  ${blocoPerfil}

  <h2>${t('sintese-tabela-titulo')}</h2>
  <table>
    <thead><tr><th>${t('th-bloco')}</th><th>${t('th-prontidao')}</th><th>${t('th-impacto')}</th><th>${t('th-prioridade')}</th></tr></thead>
    <tbody>${linhasDiagnostico || `<tr><td colspan="4">${t('sintese-nenhum-avaliado')}</td></tr>`}</tbody>
  </table>

  <h2>${t('sintese-aprofundados-titulo')}</h2>
  ${listaAprofundados}

  <footer>
    <div class="logos">
      ${logoUab ? `<img src="${logoUab}" alt="Universidade Aberta">` : ''}
      ${logoUtad ? `<img src="${logoUtad}" alt="UTAD — Universidade de Trás-os-Montes e Alto Douro">` : ''}
    </div>
    <p>${t('rodape-texto')}</p>
  </footer>
</body>
</html>`;
}

document.getElementById('descarregar-resumo').addEventListener('click', async () => {
  const botao = document.getElementById('descarregar-resumo');
  botao.disabled = true;
  try {
    const html = await construirResumoHTML();
    descarregarFicheiro(html, `llm-em-pme-resumo-${Date.now()}.html`, 'text/html');
    enviarParaGoogleSheets(construirRegisto());
  } finally {
    botao.disabled = false;
  }
});

document.getElementById('guardar-contacto').addEventListener('click', () => {
  const email = document.getElementById('contacto-email').value.trim();
  const aceite = document.getElementById('contacto-consentimento').checked;
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const mensagem = document.getElementById('contacto-mensagem');

  if (!emailValido || !aceite) {
    mensagem.textContent = t('contacto-email-invalido');
    mensagem.hidden = false;
    return;
  }

  const estadoAtual = lerEstado();
  estadoAtual.contacto = { email, consentimento: true, guardadoEm: new Date().toISOString() };
  guardarEstado(estadoAtual);

  enviarParaGoogleSheets({ tipo: 'contacto', email, consentimento: true, data: new Date().toISOString() });

  mensagem.textContent = t('contacto-confirmacao');
  mensagem.hidden = false;
});

document.querySelectorAll('#recomecar-1, #recomecar-2').forEach(botao => {
  botao.addEventListener('click', () => {
    if (confirm(t('sessao-recomecar-confirmar'))) {
      limparEstado();
      window.location.href = 'index.html';
    }
  });
});

document.getElementById('terminar').addEventListener('click', () => {
  if (confirm(t('sessao-terminar-confirmar'))) {
    limparEstado();
    document.getElementById('conteudo-sessao').hidden = true;
    document.getElementById('ecra-fim').hidden = false;
    window.close();
  }
});

document.addEventListener('idioma:alterado', () => {
  renderTabela();
  renderAprofundados();
});

renderTabela();
renderAprofundados();
atualizarMapa();
restaurarSatisfacao();
configurarLinkVoltarInstrumento();
irParaPasso(1);
