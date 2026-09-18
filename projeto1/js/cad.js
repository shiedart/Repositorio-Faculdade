  const FIELDS = ['nome','celular','email','senha','cpf','genero','nasc','cep','cidade','estado','bairro','rua','numero','complemento'];
  const LABELS = {
    nome:'Nome', celular:'Celular', email:'E-mail', senha:'Senha', cpf:'CPF',
    genero:'Gênero', nasc:'Nascimento', cep:'CEP', cidade:'Cidade',
    estado:'Estado', bairro:'Bairro', rua:'Rua', numero:'Número', complemento:'Complemento'
  };

  /* ── STORAGE ─────────────────────────────────── */
  function saveToStorage() {
    const data = {};
    FIELDS.forEach(id => {
      // Não salva senha no localStorage por segurança
      if (id === 'senha') return;
      data[id] = document.getElementById(id).value;
    });
    data._savedAt = new Date().toLocaleString('pt-BR');
    localStorage.setItem('cadastro', JSON.stringify(data));
  }

  function loadFromStorage() {
    const raw = localStorage.getItem('cadastro');
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      FIELDS.forEach(id => {
        if (id === 'senha') return; // nunca carrega senha do storage
        const el = document.getElementById(id);
        if (el && data[id]) el.value = data[id];
      });
    } catch(e) {}
  }

  FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', saveToStorage);
    if (el) el.addEventListener('change', saveToStorage);
  });

  /* ── MÁSCARAS ─────────────────────────────────── */
  document.getElementById('celular').addEventListener('input', function() {
    let v = this.value.replace(/\D/g,'').slice(0,11);
    if (v.length > 6) v = '(' + v.slice(0,2) + ') ' + v.slice(2,7) + '-' + v.slice(7);
    else if (v.length > 2) v = '(' + v.slice(0,2) + ') ' + v.slice(2);
    else if (v.length > 0) v = '(' + v;
    this.value = v;
  });

  document.getElementById('cpf').addEventListener('input', function() {
    let v = this.value.replace(/\D/g,'').slice(0,11);
    if (v.length > 9) v = v.slice(0,3)+'.'+v.slice(3,6)+'.'+v.slice(6,9)+'-'+v.slice(9);
    else if (v.length > 6) v = v.slice(0,3)+'.'+v.slice(3,6)+'.'+v.slice(6);
    else if (v.length > 3) v = v.slice(0,3)+'.'+v.slice(3);
    this.value = v;
  });

  document.getElementById('cep').addEventListener('input', function() {
    let v = this.value.replace(/\D/g,'').slice(0,8);
    if (v.length > 5) v = v.slice(0,5) + '-' + v.slice(5);
    this.value = v;
    if (v.replace(/\D/g,'').length === 8) fetchCEP(v.replace(/\D/g,''));
  });

  /* ── CEP AUTOCOMPLETE ─────────────────────────── */
  async function fetchCEP(cep) {
    const hint = document.getElementById('cep-hint');
    hint.textContent = 'Buscando endereço...';
    try {
      const r = await fetch('https://viacep.com.br/ws/'+cep+'/json/');
      const d = await r.json();
      if (d.erro) { hint.textContent = 'CEP não encontrado.'; return; }
      document.getElementById('rua').value    = d.logradouro || '';
      document.getElementById('bairro').value = d.bairro     || '';
      document.getElementById('cidade').value = d.localidade || '';
      document.getElementById('estado').value = d.uf         || '';
      hint.textContent = d.bairro + ', ' + d.localidade + ' - ' + d.uf;
      saveToStorage();
    } catch(e) { hint.textContent = 'Não foi possível buscar o CEP.'; }
  }

  /* ── TOGGLE VISIBILIDADE SENHA ─────────────────── */
  document.querySelectorAll('.toggle-pw').forEach(btn => {
    btn.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input.type === 'password') {
        input.type = 'text';
        this.textContent = '🙈';
      } else {
        input.type = 'password';
        this.textContent = '👁';
      }
    });
  });

  /* ── VALIDAÇÕES ───────────────────────────────── */
  function setError(fieldId, hasError) {
    document.getElementById(fieldId).classList.toggle('has-error', hasError);
    return !hasError;
  }

  function validarSenha(senha) {
    if (senha.length < 6)          return false; // mínimo 6 caracteres
    if (!/[a-z]/.test(senha))      return false; // ao menos 1 minúscula
    if (!/[A-Z]/.test(senha))      return false; // ao menos 1 maiúscula
    if (!/[0-9]/.test(senha))      return false; // ao menos 1 número
    if (!/[^a-zA-Z0-9]/.test(senha)) return false; // ao menos 1 especial
    return true;
  }

  function validateStep1() {
    const nome  = document.getElementById('nome').value.trim();
    const cel   = document.getElementById('celular').value.replace(/\D/g,'');
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const confirma = document.getElementById('confirmasenha').value;

    const v1 = setError('f-nome',        nome.split(' ').filter(Boolean).length < 2);
    const v2 = setError('f-celular',     cel.length < 10);
    const v3 = setError('f-email',       !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    const v4 = setError('f-senha',       !validarSenha(senha));
    const v5 = setError('f-confirmasenha', senha !== confirma || confirma.length === 0);

    return v1 && v2 && v3 && v4 && v5;
  }

  function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    // Rejeita sequências iguais: 000...0, 111...1, etc.
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    // 1º dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;
    // 2º dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[10])) return false;
    return true;
  }

  function validateStep2() {
    const cpf  = document.getElementById('cpf').value.replace(/\D/g,'');
    const gen  = document.getElementById('genero').value;
    const nasc = document.getElementById('nasc').value;
    const today = new Date();
    const nascDate = new Date(nasc);
    const age = today.getFullYear() - nascDate.getFullYear();
    const v1 = setError('f-cpf',    !validarCPF(cpf));
    const v2 = setError('f-genero', !gen);
    const v3 = setError('f-nasc',   !nasc || age < 0 || age > 120);
    return v1 && v2 && v3;
  }

  /* ── NAVEGAÇÃO ENTRE PASSOS ───────────────────── */
  function goStep(n) {
    if (n === 2 && !validateStep1()) return;
    if (n === 3 && !validateStep2()) return;
    saveToStorage();

    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel'+n).classList.add('active');

    for (let i = 1; i <= 3; i++) {
      const dot = document.getElementById('dot'+i);
      dot.classList.remove('active','done');
      if (i < n)      { dot.classList.add('done');   dot.textContent = '✓'; }
      else if (i===n) { dot.classList.add('active'); dot.textContent = i;   }
      else            { dot.textContent = i; }
    }
    for (let i = 1; i <= 2; i++) {
      document.getElementById('line'+i).classList.toggle('done', i < n);
    }
  }

  /* ── SUBMISSÃO ────────────────────────────────── */
  function submitForm() {
    saveToStorage();

    const data = JSON.parse(localStorage.getItem('cadastro') || '{}');

  data.senha = document.getElementById('senha').value;
  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  let usuarioExistente = usuarios.findIndex(usuario => usuario.email === data.email);
    if (usuarioExistente >= 0) {
  usuarios[usuarioExistente] = data;
    } else {
  usuarios.push(data);
}

localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    // Campos exibidos no resumo (senha nunca é exibida)
    const showFields = ['nome','celular','email','cpf','genero','nasc','cep','cidade','estado','bairro','rua','numero','complemento'];
    let rows = '';
    showFields.forEach(id => {
      const val = data[id];
      if (val) rows += `<tr><td>${LABELS[id]}</td><td><strong>${val}</strong></td></tr>`;
    });
    if (data._savedAt) rows += `<tr><td>Salvo em</td><td style="color:#aaa">${data._savedAt}</td></tr>`;
    document.getElementById('summary-table').innerHTML = rows;

    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel-done').classList.add('active');
    for (let i = 1; i <= 3; i++) {
      const dot = document.getElementById('dot'+i);
      dot.classList.remove('active');
      dot.classList.add('done');
      dot.textContent = '✓';
    }
    document.getElementById('line1').classList.add('done');
    document.getElementById('line2').classList.add('done');
    document.getElementById('nome-final').textContent =
      document.getElementById('nome').value.trim().split(' ')[0];
  }

  /* ── NOVO CADASTRO ────────────────────────────── */
  function novocadastro() {
    localStorage.removeItem('cadastro');
    FIELDS.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    // Garante que os campos de senha voltam para type="password"
    ['senha','confirmasenha'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.type = 'password';
    });
    document.querySelectorAll('.toggle-pw').forEach(btn => btn.textContent = '👁');

    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel1').classList.add('active');
    for (let i = 1; i <= 3; i++) {
      const dot = document.getElementById('dot'+i);
      dot.classList.remove('active','done');
      dot.textContent = i;
    }
    document.getElementById('dot1').classList.add('active');
    document.getElementById('line1').classList.remove('done');
    document.getElementById('line2').classList.remove('done');
  }

  window.addEventListener('DOMContentLoaded', loadFromStorage);
  
// Editar Cadastro //
  function editarCadastro() {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel1').classList.add('active');
  document.getElementById('dot1').classList.add('active');
  document.getElementById('dot2').classList.remove('active');
  document.getElementById('dot3').classList.remove('active');
  alert('Altere os dados desejados e clique em Cadastrar novamente.');
}
// Excluir Cadastro // 
function excluirCadastro() {
  const confirmar = confirm('Deseja realmente excluir seu cadastro?');
  if (!confirmar) return;
  const cadastro = JSON.parse(localStorage.getItem('cadastro')) || {};
  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  usuarios = usuarios.filter(usuario => usuario.email !== cadastro.email);
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
  localStorage.removeItem('cadastro');
  localStorage.removeItem('usuarioLogado');
  alert('Cadastro excluído com sucesso!');
  novocadastro();
}
