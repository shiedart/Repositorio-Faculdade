let form = document.getElementById("formLogin");
window.addEventListener(
    "DOMContentLoaded",
    function(){

        let emailSalvo =
        localStorage.getItem(
            "emailSalvo"
        );

        if(emailSalvo){
            document.getElementById(
                "email"
            ).value = emailSalvo;

            document.getElementById(
                "lembrarSenha"
            ).checked = true;
        }
    }
);
form.addEventListener("submit", function(e){
    e.preventDefault();
    let email = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;
    let lembrarSenha = document.getElementById("lembrarSenha");
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    console.log(usuarios);
    let loginCorreto = false;
    for(let i = 0; i < usuarios.length; i++){
        if(
            usuarios[i].email == email &&
            usuarios[i].senha == senha
        ){
            loginCorreto = true;
            localStorage.setItem(
                "usuarioLogado",
                JSON.stringify(usuarios[i])
            );
        }
    }
    if(loginCorreto){ 
      if(lembrarSenha.checked){
    localStorage.setItem(
        "emailSalvo",
        email
    );
}else{
    localStorage.removeItem(
        "emailSalvo"
    );
}  alert("Login realizado!");
        window.location.href = "../index.html";
    }else{
        document.getElementById("mensagem").innerHTML =
        "Email ou senha incorretos";
    }
});
