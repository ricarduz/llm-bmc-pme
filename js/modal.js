/**
 * modal.js — motor genérico de modais, partilhado por todas as páginas.
 *
 * A ideia: em vez de escrever lógica de abrir/fechar para cada modal
 * (o "Sobre este projeto", os três de explicação dos instrumentos no
 * index, etc.), qualquer par de elementos "gatilho + modal" liga-se
 * automaticamente através de dois atributos:
 *
 *   <button data-modal-trigger="sobre">...</button>
 *   <div class="modal-backdrop" data-modal="sobre">...</div>
 *
 * Isto corre uma vez, ao carregar a página, e liga TODOS os pares que
 * encontrar — não é preciso registar cada modal à mão.
 */

function initModais() {
  document.querySelectorAll('[data-modal-trigger]').forEach(gatilho => {
    const alvo = gatilho.getAttribute('data-modal-trigger');
    const modal = document.querySelector(`[data-modal="${alvo}"]`);
    if (!modal) return; // gatilho órfão (sem modal correspondente) — ignora em vez de rebentar

    // Cada modal tem de ter um botão .modal-fechar lá dentro (o "×" no canto).
    const fechar = modal.querySelector('.modal-fechar');

    function abrirModal() {
      modal.hidden = false;
      document.body.style.overflow = 'hidden'; // impede scroll da página por trás do modal
      if (fechar) fechar.focus(); // acessibilidade: o foco vai logo para o botão de fechar
    }

    function fecharModal() {
      modal.hidden = true;
      document.body.style.overflow = '';
      gatilho.focus(); // devolve o foco a quem abriu o modal, para quem navega por teclado não se perder
    }

    // Guarda-se a função de fechar no próprio elemento do modal, para o
    // listener global do Escape (mais abaixo) conseguir fechar qualquer
    // modal que esteja aberto sem ter de saber de antemão qual é.
    modal._fecharModal = fecharModal;

    gatilho.addEventListener('click', abrirModal);

    // Os gatilhos da mini-grelha BMC já são <button>, mas os três cartões
    // de instrumento no index são <div>. Um <div> não recebe foco nem
    // eventos de teclado por defeito, por isso simula-se aqui o
    // comportamento de um botão: role="button", tabindex para entrar na
    // ordem de tabulação, e Enter/Espaço a funcionar como clique.
    if (gatilho.tagName !== 'BUTTON' && gatilho.tagName !== 'A') {
      gatilho.setAttribute('role', 'button');
      gatilho.setAttribute('tabindex', '0');
      gatilho.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); // impede a página de fazer scroll ao carregar em espaço
          abrirModal();
        }
      });
    }

    if (fechar) fechar.addEventListener('click', fecharModal);

    // Clicar no fundo escurecido (fora da caixa branca) também fecha —
    // por isso se compara e.target === modal e não algo lá dentro.
    modal.addEventListener('click', (e) => {
      if (e.target === modal) fecharModal();
    });
  });

  // Um único listener para a tecla Escape, fora do forEach: percorre
  // todos os modais visíveis neste momento (normalmente só um) e fecha-os.
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.modal-backdrop:not([hidden])').forEach(modal => {
      if (modal._fecharModal) modal._fecharModal();
    });
  });
}

document.addEventListener('DOMContentLoaded', initModais);
