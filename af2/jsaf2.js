// fazer data de nascimento nser maior que dia atual {OK!}
//fazer confirmação de senha {OK!}
//fazer que caso a opção de genero seja ''outra'' digitar

let senha = document.getElementById('senha');
let consenha = document.getElementById('consenha');

function validarSenha() {
  if (senha.value != consenha.value) {
    consenha.setCustomValidity("Senhas diferentes!");
    consenha.reportValidity();
    return false;
  } else {
    consenha.setCustomValidity("");
    return true;
  }
}


consenha.addEventListener('input', validarSenha);

// confirmação de senha /\  \/ confirmação de data de nascimento  


const campoData = document.getElementById("dnasc");
const hoje = new Date();
const dataMax = hoje.toISOString().split("T")[0];
const dataMinObj = new Date();
dataMinObj.setFullYear(hoje.getFullYear() - 120);
const dataMin = dataMinObj.toISOString().split("T")[0];
campoData.max = dataMax;
campoData.min = dataMin;  

// /\ confirmação de nascimento \/ Aparecer uma linha para de digitar em caso de outro na opção genero

const selectGenero = document.getElementById("genero");
    const campoOutro = document.getElementById("ogenero");

    selectGenero.addEventListener("change", function() {

        if (this.value === "outros") {
            campoOutro.style.display = "block";
            campoOutro.required = true;
        } else {
            campoOutro.style.display = "none";
            campoOutro.required = false;
            campoOutro.value = "";
        }

    });

    // confirmação de email \/

    const emailInput = document.getElementById("email");
    const mensagemErro = document.getElementById("smail");

    emailInput.addEventListener("input", function () {

        
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/;

        if (regex.test(emailInput.value)) {

            
            emailInput.style.border = "2px solid green";
            mensagemErro.textContent = "";

        } else {

            
            emailInput.style.border = "2px solid red";
            // mensagemErro.textContent = "Digite um e-mail válido terminado em .com";

        }

    });