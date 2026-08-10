/**
 * relatorio-utils.js — funções partilhadas entre pme.js e resultados.js
 * para construir os ficheiros HTML exportados (relatório da PME e
 * resumo da avaliação do especialista). Estavam duplicadas nos dois
 * ficheiros, escritas de forma ligeiramente diferente — centralizou-se
 * aqui para não haver duas versões da mesma lógica a divergir com o
 * tempo. Carregado por pme.html e resultados.html, antes do respetivo
 * ficheiro principal.
 */

/**
 * Escapa caracteres HTML especiais antes de inserir texto livre do
 * utilizador (reflexão, comentários, email) num template de HTML —
 * sem isto, um "<" ou ">" escrito pelo especialista partia a estrutura
 * do ficheiro exportado, e em teoria podia chegar a executar algo.
 */
function escaparHTML(texto) {
  if (!texto) return '';
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Plano B para incorporar uma imagem no ficheiro exportado, usado quando
 * o fetch() em imagemParaDataURL() falha — o que acontece sempre que a
 * página é aberta por duplo-clique (protocolo file://), onde os
 * navegadores bloqueiam fetch() a outros ficheiros locais por política
 * de CORS. Um <img> não tem essa restrição, por isso carrega-se a
 * imagem "à moda antiga" e lê-se o resultado através de um <canvas>.
 * Exporta-se sempre em PNG (não JPEG): se um dia os logótipos passarem a
 * ter fundo transparente, um JPEG preenchia essa transparência a preto —
 * o PNG evita essa armadilha, sem custo real (são ficheiros pequenos).
 */
function imagemParaDataURLViaCanvas(caminho) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext('2d').drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        console.error(`Canvas não conseguiu converter ${caminho}:`, e);
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = caminho;
  });
}

/**
 * Tenta primeiro o caminho "normal" (fetch + FileReader, preserva os
 * bytes originais tal e qual). Se isso rebentar — tipicamente por causa
 * do file:// — cai para o plano B via <canvas>. Se os dois falharem,
 * devolve null e quem chama trata disso mostrando o rodapé sem logótipo,
 * em vez de partir o ficheiro inteiro.
 */
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
    return await imagemParaDataURLViaCanvas(caminho);
  }
}

/**
 * Rótulo legível do escalão de faturação (ex: "≤ 10 milhões € (pequena)")
 * — reutiliza as chaves perfil-escalao-* já traduzidas em i18n.js. Média
 * e grande têm rótulo próprio por critério (volume de negócios vs
 * balanço total, Recomendação 2003/361/CE); micro e pequena partilham
 * o mesmo rótulo independentemente do critério escolhido.
 */
function rotuloEscalao(criterio, escalao) {
  if (escalao === 'media' || escalao === 'grande') return t(`perfil-escalao-${escalao}-${criterio}`);
  return t(`perfil-escalao-${escalao}`);
}
