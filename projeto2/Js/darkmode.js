"use strict";

const botaoDarkMode = document.getElementById("darkModeToggle");
const temaSalvo = localStorage.getItem("tema");

function aplicarTema(escuro) {
  document.body.classList.toggle("dark-mode", escuro);
  if (!botaoDarkMode) return;
  botaoDarkMode.textContent = escuro ? "☀️" : "🌙";
  botaoDarkMode.setAttribute("aria-label", escuro ? "Ativar modo claro" : "Ativar modo escuro");
}

aplicarTema(temaSalvo === "escuro");

if (botaoDarkMode) {
  botaoDarkMode.addEventListener("click", () => {
    const escuro = !document.body.classList.contains("dark-mode");
    localStorage.setItem("tema", escuro ? "escuro" : "claro");
    aplicarTema(escuro);
  });
}
