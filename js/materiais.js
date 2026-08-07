/**
 * materiais.js — troca de separador (Instrumento 1/2/3) na página de
 * materiais, e navegação para o passo seguinte (cenario.html). Não
 * depende de estado de sessão nenhum — esta página é só de consulta,
 * antes de o diagnóstico começar.
 */

document.querySelectorAll('.aba-ficha').forEach(botao => {
  botao.addEventListener('click', () => {
    document.querySelectorAll('.aba-ficha').forEach(b => {
      b.classList.remove('ativa');
      b.setAttribute('aria-selected', 'false');
    });
    botao.classList.add('ativa');
    botao.setAttribute('aria-selected', 'true');

    document.querySelectorAll('.painel-material').forEach(painel => { painel.hidden = true; });
    document.getElementById(`painel-material-${botao.dataset.aba}`).hidden = false;
  });
});

document.getElementById('continuar').addEventListener('click', () => {
  window.location.href = 'cenario.html';
});
