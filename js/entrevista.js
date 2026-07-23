/**
 * entrevista.js — a página intermédia do percurso de especialistas.
 * Recolhe o perfil do especialista (Gestor PME / Profissional de TI /
 * Académico — os três perfis E1/E2/E3 do painel de avaliação, Tabela 4
 * da dissertação) e a autorização de participação, antes de avançar
 * para o Instrumento 1. Ainda só grava em localStorage — a ligação ao
 * Google Sheets para este campo fica para mais tarde.
 *
 * O email para receber os resultados do estudo pede-se no fim
 * (resultados.html), não aqui — não faz sentido pedir duas vezes.
 */

const checkbox = document.getElementById('autorizacao');
const botaoContinuar = document.getElementById('btn-continuar');

function validarEntrevista() {
  const perfilEscolhido = document.querySelector('input[name="perfil-especialista"]:checked');
  botaoContinuar.disabled = !(checkbox.checked && perfilEscolhido);
}

checkbox.addEventListener('change', validarEntrevista);
document.querySelectorAll('input[name="perfil-especialista"]').forEach(input => {
  input.addEventListener('change', validarEntrevista);
});

botaoContinuar.addEventListener('click', () => {
  const perfilEscolhido = document.querySelector('input[name="perfil-especialista"]:checked');
  const estado = lerEstado();
  estado.perfilUtilizador = 'especialista';
  estado.perfilEspecialista = perfilEscolhido ? perfilEscolhido.value : ''; // gestor-pme | profissional-ti | academico
  estado.consentimento = true; // a "autorização" desta página é o próprio consentimento, com uma redação mais direta do que o texto legal genérico
  guardarEstado(estado);
  window.location.href = 'cenario.html';
});
