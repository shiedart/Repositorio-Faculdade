"use strict";

const cabecalho = document.querySelector(".site-header");
let ultimaPosicao = window.scrollY;
let aguardandoAtualizacao = false;

function atualizarCabecalho() {
  const posicaoAtual = window.scrollY;
  const descendo = posicaoAtual > ultimaPosicao;
  const passouDoTopo = posicaoAtual > cabecalho.offsetHeight;

  cabecalho.classList.toggle("is-hidden", descendo && passouDoTopo);
  cabecalho.classList.toggle("scrolled", passouDoTopo);
  ultimaPosicao = posicaoAtual;
  aguardandoAtualizacao = false;
}

if (cabecalho) {
  window.addEventListener("scroll", () => {
    if (!aguardandoAtualizacao) {
      window.requestAnimationFrame(atualizarCabecalho);
      aguardandoAtualizacao = true;
    }
  }, { passive: true });

  const acoes = cabecalho.querySelector('.nav-actions');
  const emailLogado = sessionStorage.getItem('gotogether_logado');

  if (acoes && emailLogado) {
    let cadastro = null;
    try {
      cadastro = JSON.parse(localStorage.getItem('cadastro') || 'null');
    } catch (error) {
      cadastro = null;
    }

    const nome = cadastro && cadastro.nome ? cadastro.nome : emailLogado.split('@')[0];
    acoes.querySelectorAll('a').forEach((link) => {
      if (/login\.html|cadastro\.html/.test(link.href)) link.remove();
    });

    if (!acoes.querySelector('.profile-link')) {
      const perfil = document.createElement('a');
      perfil.className = 'profile-link';
      perfil.href = cabecalho.querySelector('.brand').href.replace(/index\.html$/, 'html/perfil.html');
      perfil.textContent = 'Meu perfil';
      acoes.append(perfil);
    }

    const saudacao = document.createElement('span');
    saudacao.className = 'account-greeting';
    saudacao.textContent = `Olá, ${nome}`;
    saudacao.setAttribute('aria-label', `Conectado como ${nome}`);

    const sair = document.createElement('button');
    sair.className = 'logout-btn';
    sair.type = 'button';
    sair.textContent = 'Sair';
    sair.addEventListener('click', () => {
      sessionStorage.removeItem('gotogether_logado');
      window.location.reload();
    });

    acoes.append(saudacao, sair);
  }
}
