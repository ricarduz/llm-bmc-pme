/**
 * index.js — página de entrada. Só tem uma responsabilidade: perguntar
 * "é uma PME ou é um especialista do painel de avaliação?" e encaminhar
 * para o caminho certo.
 *   PME         -> pme.html (o "jogo", que recolhe o perfil da empresa
 *                  como parte do seu próprio fluxo contínuo)
 *   Especialista -> entrevista.html (explica a sessão, espaço para
 *                  vídeo, autorização — sem caracterizar nenhuma
 *                  empresa, o painel não precisa disso)
 */

document.getElementById('escolha-pme').addEventListener('click', () => {
  const estado = lerEstado();
  estado.perfilUtilizador = 'pme';
  guardarEstado(estado);
  window.location.href = 'pme.html';
});

document.getElementById('escolha-especialista').addEventListener('click', () => {
  const estado = lerEstado();
  estado.perfilUtilizador = 'especialista';
  guardarEstado(estado);
  window.location.href = 'entrevista.html';
});
