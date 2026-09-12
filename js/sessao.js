/**
 * sessao.js — mostra a Síntese Teórica só ao especialista de perfil
 * académico (lido de estado.perfilEspecialista, guardado em
 * entrevista.js). A Nota de Sessão é sempre visível, para os três
 * perfis.
 */

const estadoSessao = lerEstado();
if (estadoSessao.perfilEspecialista === 'academico') {
  document.getElementById('doc-sintese-e3').hidden = false;
}

document.getElementById('continuar').addEventListener('click', () => {
  window.location.href = 'materiais.html';
});
