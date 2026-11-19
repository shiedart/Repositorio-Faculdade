'use strict';

const formLogin = document.getElementById('form-login');
const statusLogin = document.getElementById('status-login');

formLogin.addEventListener('submit', async (event) => {
  event.preventDefault();

  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');
  const email = emailInput.value.trim().toLowerCase();
  const senha = senhaInput.value;
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  document.getElementById('erro-email').textContent = emailValido ? '' : 'Informe um e-mail válido.';
  document.getElementById('erro-senha').textContent = senha ? '' : 'Informe sua senha.';
  emailInput.setAttribute('aria-invalid', String(!emailValido));
  senhaInput.setAttribute('aria-invalid', String(!senha));
  statusLogin.textContent = '';
  statusLogin.classList.remove('login-error');

  if (!emailValido || !senha) return;

  const botao = formLogin.querySelector('button[type="submit"], input[type="submit"]');
  if (botao) botao.disabled = true;
  statusLogin.textContent = 'Verificando login...';

  try {
    const resposta = await fetch('../php/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const resultado = await resposta.json();

    if (!resposta.ok || !resultado.sucesso) {
      statusLogin.textContent = resultado.mensagem || 'E-mail ou senha incorretos.';
      statusLogin.classList.add('login-error');
      return;
    }

    statusLogin.textContent = resultado.mensagem || 'Login realizado!';
    window.location.href = '../index.html';
  } catch (erro) {
    console.error('Erro ao realizar login:', erro);
    statusLogin.textContent = 'Não foi possível conectar ao servidor. Verifique se o Apache está ligado.';
    statusLogin.classList.add('login-error');
  } finally {
    if (botao) botao.disabled = false;
  }
});
