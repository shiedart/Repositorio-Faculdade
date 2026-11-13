'use strict';

const DIAS_COOKIE = 7;
const MIN_SENHA = 8;
const PREFIXO_COOKIE = 'cadastro_';

const DDDS_VALIDOS = [
  11, 12, 13, 14, 15, 16, 17, 18, 19,
  21, 22, 24, 27, 28,
  31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49,
  51, 53, 54, 55,
  61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79,
  81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 97, 98, 99
];

const CAMPOS = [
  'nome', 'sobrenome', 'cpf', 'nascimento', 'genero', 'celular',
  'cep', 'logradouro', 'numero', 'bairro',
  'email', 'senha', 'confirmarSenha'
];

const $ = (id) => document.getElementById(id);
const somenteDigitos = (v) => v.replace(/\D/g, '');

function dataISO(d) {
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

function limitesNascimento() {
  const hoje = new Date();
  const minimo = new Date(hoje.getFullYear() - 100, hoje.getMonth(), hoje.getDate());
  return { min: dataISO(minimo), max: dataISO(hoje) };
}

function mascaraCPF(v) {
  return somenteDigitos(v).slice(0, 11)
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

function mascaraCelular(v) {
  const d = somenteDigitos(v).slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function mascaraCEP(v) {
  const d = somenteDigitos(v).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

function validarCPF(valor) {
  const d = somenteDigitos(valor);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;

  const digito = (qtd) => {
    let soma = 0;
    for (let i = 0; i < qtd; i++) soma += Number(d[i]) * (qtd + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return digito(9) === Number(d[9]) && digito(10) === Number(d[10]);
}

function validarCelular(valor) {
  const d = somenteDigitos(valor);
  if (d.length !== 11) return false;
  if (!DDDS_VALIDOS.includes(Number(d.slice(0, 2)))) return false;
  return d[2] === '9';
}

function validarEmail(valor) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/.test(valor.trim());
}

const REGRAS_SENHA = {
  tamanho: (s) => s.length >= MIN_SENHA,
  maiuscula: (s) => /\p{Lu}/u.test(s),
  minuscula: (s) => /\p{Ll}/u.test(s),
  numero: (s) => /\d/.test(s),
  especial: (s) => /[^\p{L}\p{N}\s]/u.test(s)
};

function atualizarRegrasSenha() {
  const senha = $('senha').value;
  document.querySelectorAll('#regras-senha li').forEach((li) => {
    const ok = REGRAS_SENHA[li.dataset.regra](senha);
    li.classList.toggle('valida', ok);
    li.querySelector('.marca').textContent = ok ? '✔' : '✖';
  });
}

const estadoCEP = { ok: false, erro: '' };

const validadores = {
  nome: (v) => /^\p{L}[\p{L}\s'.-]+$/u.test(v.trim()) ? '' : 'Informe um nome válido (mín. 2 letras).',
  sobrenome: (v) => /^\p{L}[\p{L}\s'.-]+$/u.test(v.trim()) ? '' : 'Informe um sobrenome válido (mín. 2 letras).',

  cpf: (v) => {
    if (!somenteDigitos(v)) return 'Informe o CPF.';
    return validarCPF(v) ? '' : 'CPF inválido.';
  },

  nascimento: (v) => {
    if (!v) return 'Informe a data de nascimento.';
    const { min, max } = limitesNascimento();
    if (v > max) return 'A data de nascimento não pode ser futura.';
    if (v < min) return 'A idade máxima permitida é de 100 anos.';
    return '';
  },

  genero: () => document.querySelector('input[name="genero"]:checked') ? '' : 'Selecione uma opção.',

  celular: (v) => {
    if (!somenteDigitos(v)) return 'Informe o celular.';
    return validarCelular(v) ? '' : 'Celular inválido. Use DDD válido e o formato (00) 90000-0000.';
  },

  cep: (v) => {
    if (somenteDigitos(v).length !== 8) return 'Informe um CEP com 8 dígitos.';
    if (estadoCEP.erro) return estadoCEP.erro;
    return estadoCEP.ok ? '' : 'Aguarde a consulta do CEP.';
  },

  logradouro: (v) => v.trim() ? '' : 'Informe o logradouro.',
  numero: (v) => v.trim() ? '' : 'Informe o número (ou S/N).',
  bairro: (v) => v.trim() ? '' : 'Informe o bairro.',

  email: (v) => {
    if (!v.trim()) return 'Informe o e-mail.';
    return validarEmail(v) ? '' : 'E-mail inválido.';
  },

  senha: (v) => {
    if (!v) return 'Informe a senha.';
    const atende = Object.values(REGRAS_SENHA).every((regra) => regra(v));
    return atende ? '' : 'A senha não atende a todos os requisitos.';
  },

  confirmarSenha: (v) => {
    if (!v) return 'Confirme a senha.';
    return v === $('senha').value ? '' : 'As senhas não coincidem.';
  }
};

function mostrarErro(id, mensagem) {
  $(`erro-${id}`).textContent = mensagem;
  document.getElementsByName(id).forEach((el) => {
    el.setAttribute('aria-invalid', mensagem ? 'true' : 'false');
  });
}

function validarCampo(id) {
  const valor = id === 'genero' ? '' : $(id).value;
  const mensagem = validadores[id](valor);
  mostrarErro(id, mensagem);
  return mensagem === '';
}

function limparEndereco() {
  ['logradouro', 'bairro', 'cidade', 'uf'].forEach((id) => { $(id).value = ''; });
  $('resultado-cep').textContent = '';
}

async function buscarCEP() {
  const cep = somenteDigitos($('cep').value);
  estadoCEP.ok = false;
  estadoCEP.erro = '';
  $('resultado-cep').textContent = 'Consultando CEP...';

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!resposta.ok) throw new Error('Falha na requisição');
    const dados = await resposta.json();

    if (somenteDigitos($('cep').value) !== cep) return;

    if (dados.erro) {
      estadoCEP.erro = 'CEP não encontrado.';
      limparEndereco();
    } else {
      estadoCEP.ok = true;
      $('logradouro').value = dados.logradouro || '';
      $('bairro').value = dados.bairro || '';
      $('cidade').value = dados.localidade || '';
      $('uf').value = dados.uf || '';

      const partes = [dados.logradouro, dados.bairro, `${dados.localidade}/${dados.uf}`].filter(Boolean);
      $('resultado-cep').textContent = `Endereço encontrado: ${partes.join(' – ')}`;
      mostrarErro('logradouro', '');
      mostrarErro('bairro', '');
      $('numero').focus();
    }
  } catch (e) {
    if (somenteDigitos($('cep').value) !== cep) return;
    estadoCEP.erro = 'Não foi possível consultar o CEP. Verifique sua conexão.';
    limparEndereco();
  }

  validarCampo('cep');
}

const form = $('form-cadastro');

const mascaras = { cpf: mascaraCPF, celular: mascaraCelular, cep: mascaraCEP };

form.addEventListener('input', (e) => {
  const campo = e.target;
  const id = campo.id;

  if (mascaras[id]) campo.value = mascaras[id](campo.value);

  if (id === 'cep') {
    estadoCEP.ok = false;
    estadoCEP.erro = '';
    limparEndereco();
    if (somenteDigitos(campo.value).length === 8) buscarCEP();
  }

  if (id === 'senha') {
    atualizarRegrasSenha();
    if ($('confirmarSenha').value) validarCampo('confirmarSenha');
  }

  if (campo.getAttribute('aria-invalid') === 'true' && validadores[campo.name]) {
    validarCampo(campo.name);
  }
});

form.addEventListener('change', (e) => {
  if (e.target.name === 'genero') validarCampo('genero');
});

form.addEventListener('focusout', (e) => {
  const campo = e.target;
  if (campo.type === 'radio' || !validadores[campo.name]) return;
  if (campo.id === 'cep' && somenteDigitos(campo.value).length === 8 && !estadoCEP.ok && !estadoCEP.erro) return;
  validarCampo(campo.name);
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const status = $('status');

  const invalidos = CAMPOS.filter((id) => !validarCampo(id));

  if (invalidos.length > 0) {
    status.textContent = 'Corrija os campos destacados e tente novamente.';
    const primeiro = invalidos[0];
    (primeiro === 'genero' ? $('genero-feminino') : $(primeiro)).focus();
    return;
  }

  // Aguarda a consulta do CEP antes de enviar o cadastro.
  if (!estadoCEP.ok) {
    status.textContent = 'Aguarde a validação do CEP antes de continuar.';
    $('cep').focus();
    return;
  }

  const botao = form.querySelector('button[type="submit"], input[type="submit"]');
  if (botao) botao.disabled = true;
  status.textContent = 'Enviando cadastro...';

  try {
    const resposta = await fetch('../php/cadastrar.php', {
      method: 'POST',
      body: new FormData(form)
    });

    const resultado = await resposta.json();

    if (!resposta.ok || !resultado.sucesso) {
      status.textContent = resultado.mensagem || 'Não foi possível realizar o cadastro.';
      return;
    }

    status.textContent = resultado.mensagem || 'Cadastro realizado com sucesso!';
    form.reset();
    limparEndereco();
    estadoCEP.ok = false;
    estadoCEP.erro = '';
    atualizarRegrasSenha();
  } catch (erro) {
    console.error('Erro ao enviar cadastro:', erro);
    status.textContent = 'Não foi possível conectar ao servidor. Verifique se o Apache está ligado.';
  } finally {
    if (botao) botao.disabled = false;
  }
});

const limites = limitesNascimento();
$('nascimento').min = limites.min;
$('nascimento').max = limites.max;
atualizarRegrasSenha();
