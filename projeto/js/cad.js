  const FIELDS = ['nome','celular','email','cpf','genero','nasc','cep','cidade','estado','bairro','rua','numero','complemento'];
  const LABELS = {
    nome:'Nome', celular:'Celular', email:'E-mail', cpf:'CPF',
    genero:'Gênero', nasc:'Nascimento', cep:'CEP', cidade:'Cidade',
    estado:'Estado', bairro:'Bairro', rua:'Rua', numero:'Número', complemento:'Complemento'
  };

  function saveToStorage() {
    const data = {};
    FIELDS.forEach(id => { data[id] = document.getElementById(id).value; });
    data._savedAt = new Date().toLocaleString('pt-BR');
    localStorage.setItem('cadastro', JSON.stringify(data));
  }

  function loadFromStorage() {
    const raw = localStorage.getItem('cadastro');
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      FIELDS.forEach(id => {
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

  async function fetchCEP(cep) {
    const hint = document.getElementById('cep-hint');
    hint.textContent = 'Buscando endereço...';
    try {
      const r = await fetch('https://viacep.com.br/ws/'+cep+'/json/');
      const d = await r.json();
      if (d.erro) { hint.textContent = 'CEP não encontrado.'; return; }
      document.getElementById('rua').value = d.logradouro || '';
      document.getElementById('bairro').value = d.bairro || '';
      document.getElementById('cidade').value = d.localidade || '';
      const sel = document.getElementById('estado');
      for (let i=0; i<sel.options.length; i++) {
        if (sel.options[i].value === d.uf) { sel.selectedIndex = i; break; }
      }
      hint.textContent = d.bairro + ', ' + d.localidade + ' - ' + d.uf;
      saveToStorage();
    } catch(e) { hint.textContent = 'Não foi possível buscar o CEP.'; }
  }

  function setError(fieldId, hasError) {
    document.getElementById(fieldId).classList.toggle('has-error', hasError);
    return !hasError;
  }

  function validateStep1() {
    const nome = document.getElementById('nome').value.trim();
    const cel = document.getElementById('celular').value.replace(/\D/g,'');
    const email = document.getElementById('email').value.trim();
    const v1 = setError('f-nome', nome.split(' ').filter(Boolean).length < 2);
    const v2 = setError('f-celular', cel.length < 10);
    const v3 = setError('f-email', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    return v1 && v2 && v3;
  }

  function validateStep2() {
    const cpf = document.getElementById('cpf').value.replace(/\D/g,'');
    const gen = document.getElementById('genero').value;
    const nasc = document.getElementById('nasc').value;
    const today = new Date();
    const nascDate = new Date(nasc);
    const age = today.getFullYear() - nascDate.getFullYear();
    const v1 = setError('f-cpf', cpf.length !== 11);
    const v2 = setError('f-genero', !gen);
    const v3 = setError('f-nasc', !nasc || age < 0 || age > 120);
    return v1 && v2 && v3;
  }

  function goStep(n) {
    if (n === 2 && !validateStep1()) return;
    if (n === 3 && !validateStep2()) return;
    saveToStorage();

    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel'+n).classList.add('active');

    for (let i = 1; i <= 3; i++) {
      const dot = document.getElementById('dot'+i);
      dot.classList.remove('active','done');
      if (i < n) { dot.classList.add('done'); dot.textContent = '✓'; }
      else if (i === n) { dot.classList.add('active'); dot.textContent = i; }
      else { dot.textContent = i; }
    }
    for (let i = 1; i <= 2; i++) {
      document.getElementById('line'+i).classList.toggle('done', i < n);
    }
  }

  function submitForm() {
    saveToStorage();

    const data = JSON.parse(localStorage.getItem('cadastro') || '{}');
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
      dot.classList.remove('active'); dot.classList.add('done'); dot.textContent = '✓';
    }
    document.getElementById('line1').classList.add('done');
    document.getElementById('line2').classList.add('done');
    document.getElementById('nome-final').textContent = document.getElementById('nome').value.trim().split(' ')[0];
  }

  function novocadastro() {
    localStorage.removeItem('cadastro');
    FIELDS.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel1').classList.add('active');
    for (let i = 1; i <= 3; i++) {
      const dot = document.getElementById('dot'+i);
      dot.classList.remove('active','done'); dot.textContent = i;
    }
    document.getElementById('dot1').classList.add('active');
    document.getElementById('line1').classList.remove('done');
    document.getElementById('line2').classList.remove('done');
  }

  window.addEventListener('DOMContentLoaded', loadFromStorage);