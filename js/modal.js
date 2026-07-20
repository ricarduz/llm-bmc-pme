/**
 * Motor genérico de modais.
 * Qualquer elemento com data-modal-trigger="x" abre o elemento com
 * data-modal="x". Cada modal precisa de um botão .modal-fechar lá dentro.
 * Usado pela mini-grelha BMC (data-modal-trigger="sobre") e, no index,
 * pelos três cartões de instrumento.
 */

function initModais() {
  document.querySelectorAll('[data-modal-trigger]').forEach(gatilho => {
    const alvo = gatilho.getAttribute('data-modal-trigger');
    const modal = document.querySelector(`[data-modal="${alvo}"]`);
    if (!modal) return;

    const fechar = modal.querySelector('.modal-fechar');

    function abrirModal() {
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      if (fechar) fechar.focus();
    }

    function fecharModal() {
      modal.hidden = true;
      document.body.style.overflow = '';
      gatilho.focus();
    }

    modal._fecharModal = fecharModal;

    gatilho.addEventListener('click', abrirModal);

    if (gatilho.tagName !== 'BUTTON' && gatilho.tagName !== 'A') {
      gatilho.setAttribute('role', 'button');
      gatilho.setAttribute('tabindex', '0');
      gatilho.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          abrirModal();
        }
      });
    }

    if (fechar) fechar.addEventListener('click', fecharModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) fecharModal();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.modal-backdrop:not([hidden])').forEach(modal => {
      if (modal._fecharModal) modal._fecharModal();
    });
  });
}

document.addEventListener('DOMContentLoaded', initModais);
