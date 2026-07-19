const estadoR = lerEstado();

/**
 * Integração opcional com Google Sheets (Apps Script Web App).
 * Deixa GOOGLE_SHEETS_URL vazio para desativar o envio automático —
 * a exportação em JSON funciona sempre, independentemente disto.
 * Preencher com o URL de implementação do Apps Script quando estiver pronto.
 */
const GOOGLE_SHEETS_URL = '';

function renderTabela() {
  const linhas = BMC_BLOCOS
    .filter(b => estadoR.diagnostico[b.id])
    .map(b => {
      const r = estadoR.diagnostico[b.id];
      return `
        <tr>
          <td>${b.nome}</td>
          <td>${r.prontidao}</td>
          <td>${r.impacto}</td>
          <td><span class="selo" data-p="${r.prioridade}">${r.prioridade}</span></td>
        </tr>`;
    }).join('');

  document.getElementById('tabela-diagnostico').innerHTML = `
    <thead><tr><th>Bloco BMC</th><th>Prontidão</th><th>Impacto</th><th>Prioridade</th></tr></thead>
    <tbody>${linhas || '<tr><td colspan="4" class="nota">Nenhum bloco avaliado.</td></tr>'}</tbody>
  `;
}

function renderAprofundados() {
  const el = document.getElementById('blocos-aprofundados');
  if (estadoR.blocosSelecionados.length === 0) {
    el.innerHTML = '<p class="nota">Nenhum bloco foi selecionado para aprofundamento na Matriz.</p>';
    return;
  }
  el.innerHTML = '<ul>' + estadoR.blocosSelecionados.map(id => {
    const bloco = BMC_BLOCOS.find(b => b.id === id);
    return `<li>${bloco ? bloco.nome : id}${bloco?.ficha ? ' — com Ficha de Decisão' : ''}</li>`;
  }).join('') + '</ul>';
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

function construirRegisto() {
  return {
    concluidoEm: new Date().toISOString(),
    diagnostico: estadoR.diagnostico,
    blocosSelecionados: estadoR.blocosSelecionados
  };
}

document.getElementById('exportar').addEventListener('click', async () => {
  const registo = construirRegisto();
  const blob = new Blob([JSON.stringify(registo, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `llm-bmc-pme-sessao-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);

  if (GOOGLE_SHEETS_URL) {
    try {
      await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(registo)
      });
    } catch (e) {
      console.error('Envio para a folha de cálculo falhou (o ficheiro local foi sempre exportado):', e);
    }
  }
});

document.getElementById('reiniciar').addEventListener('click', () => {
  if (confirm('Reiniciar apaga todas as respostas guardadas neste navegador. Continuar?')) {
    limparEstado();
    window.location.href = 'index.html';
  }
});

renderTabela();
renderAprofundados();
atualizarMapa();
