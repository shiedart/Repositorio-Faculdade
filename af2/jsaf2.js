var senha = document.getElementById("senha")
  , consenha = document.getElementById("consenha");

function validatePassword(){
  if(senha.value != consenha.value) {
    consenha.setCustomValidity("Senhas diferentes!");
  } else {
    consenha.setCustomValidity('');
  }
}

senha.onchange = validatePassword;
consenha.onkeyup = validatePassword;
