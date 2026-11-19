'use strict';

const formPerfil = document.getElementById('form-perfil');
const statusPerfil = document.getElementById('profile-status');
const camposEditaveis = ['nome', 'sobrenome', 'email', 'celular'];
let dadosOriginais = {};

if (!sessionStorage.getItem('gotogether_logado')) {
  window.location.replace('login.html');
} else {
  try {
    dadosOriginais = JSON.parse(localStorage.getItem('cadastro') || '{}');
  } catch (error) {
    dadosOriginais = {};
  }

  if (!dadosOriginais.email) {
    window.location.replace('login.html');
  } else {
    ['nome', 'sobrenome', 'email', 'celular', 'cidade', 'uf'].forEach((id) => {
      document.getElementById(id).value = dadosOriginais[id] || '';
    });
    document.getElementById('profile-avatar').textContent = (dadosOriginais.nome || 'G').charAt(0).toLocaleUpperCase('pt-BR');
  }
}

function encerrarEdicao() {
  camposEditaveis.forEach((id) => {
    document.getElementById(id).disabled = true;
    document.getElementById(id).value = dadosOriginais[id] || '';
  });
  document.getElementById('edit-profile').hidden = false;
  document.getElementById('cancel-edit').hidden = true;
  document.getElementById('save-profile').hidden = true;
}

document.getElementById('edit-profile').addEventListener('click', () => {
  camposEditaveis.forEach((id) => { document.getElementById(id).disabled = false; });
  document.getElementById('edit-profile').hidden = true;
  document.getElementById('cancel-edit').hidden = false;
  document.getElementById('save-profile').hidden = false;
  statusPerfil.textContent = '';
  document.getElementById('nome').focus();
});

document.getElementById('cancel-edit').addEventListener('click', () => {
  encerrarEdicao();
  statusPerfil.textContent = 'Alterações canceladas.';
});

formPerfil.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    statusPerfil.textContent = 'Informe um e-mail válido.';
    document.getElementById('email').focus();
    return;
  }

  const atualizado = { ...dadosOriginais };
  camposEditaveis.forEach((id) => { atualizado[id] = document.getElementById(id).value.trim(); });

  try {
    const credenciais = JSON.parse(localStorage.getItem('gotogether_credenciais') || 'null');
    localStorage.setItem('cadastro', JSON.stringify(atualizado));
    if (credenciais) {
      credenciais.email = atualizado.email.toLowerCase();
      localStorage.setItem('gotogether_credenciais', JSON.stringify(credenciais));
    }
    sessionStorage.setItem('gotogether_logado', atualizado.email.toLowerCase());
    dadosOriginais = atualizado;
    document.getElementById('profile-avatar').textContent = (atualizado.nome || 'G').charAt(0).toLocaleUpperCase('pt-BR');
    statusPerfil.textContent = 'Perfil atualizado com sucesso.';
    encerrarEdicao();
  } catch (error) {
    statusPerfil.textContent = 'Não foi possível salvar as alterações. Tente novamente.';
  }
});
