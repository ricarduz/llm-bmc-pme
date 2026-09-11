/**
 * entrevista.js — a página intermédia do percurso de especialistas.
 * Recolhe o perfil do especialista (Gestor PME / Profissional de TI /
 * Académico — os três perfis E1/E2/E3 do painel de avaliação, Tabela 5
 * da dissertação) e a autorização de participação, antes de avançar
 * para o Instrumento 1. Ainda só grava em localStorage — a ligação ao
 * Google Sheets para este campo fica para mais tarde.
 *
 * O email para receber os resultados do estudo pede-se no fim
 * (resultados.html), não aqui — não faz sentido pedir duas vezes.
 */

const checkbox = document.getElementById('autorizacao');
const botaoContinuar = document.getElementById('btn-continuar');

/**
 * Tenta mostrar o vídeo de apresentação (assets/video-apresentacao.mp4).
 * Enquanto o ficheiro não existir, o <video> dispara 'error' e o
 * placeholder original fica visível — sem isto, um <video> com fonte
 * inexistente mostra uma caixa de erro do navegador, mais feia do que
 * o placeholder. Assim que colocares o ficheiro no caminho certo, isto
 * troca sozinho para o vídeo, sem precisares de mudar mais nada.
 */
const video = document.getElementById('video-apresentacao');
function mostrarVideoSeCarregado() {
  video.style.display = 'block';
  document.getElementById('video-placeholder-conteudo').style.display = 'none';
}
if (video.readyState >= 1) {
  // o vídeo já tinha metadados carregados antes deste script correr
  // (preload="metadata" começa assim que o HTML é interpretado, antes
  // deste <script>, colocado no fim da página) — sem esta verificação,
  // o evento 'loadedmetadata' já teria disparado e nunca mais dispara,
  // e o placeholder ficaria visível por engano mesmo com o vídeo pronto.
  mostrarVideoSeCarregado();
} else {
  video.addEventListener('loadedmetadata', mostrarVideoSeCarregado);
}
video.addEventListener('error', () => {
  video.style.display = 'none';
}, true);

/** O botão Continuar só ativa quando a autorização estiver marcada E um perfil de especialista tiver sido escolhido. */
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
  window.location.href = 'materiais.html';
});
