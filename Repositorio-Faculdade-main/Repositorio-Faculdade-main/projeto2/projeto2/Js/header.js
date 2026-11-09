const topbar = document.querySelector(".topbar");
let ultimoScroll = window.scrollY;

function atualizarHeader() {
  const atual = window.scrollY;
  const diferenca = atual - ultimoScroll;

  if (atual <= 80) {
    topbar.classList.remove("escondido");   // no topo: sempre visível
  } else if (diferenca > 5) {
    topbar.classList.add("escondido");      // descendo: esconde
  } else if (diferenca < -5) {
    topbar.classList.remove("escondido");   // subindo: mostra
  }

  ultimoScroll = atual;
}

if (topbar) {
  window.addEventListener("scroll", atualizarHeader, { passive: true });
  atualizarHeader();
}