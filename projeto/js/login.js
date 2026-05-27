let form = document.getElementById("formLogin");

form.addEventListener("submit", function(e){

    e.preventDefault();

    let email = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;

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

        alert("Login realizado!");

        window.location.href = "../index.html";

    }else{

        document.getElementById("mensagem").innerHTML =
        "Email ou senha incorretos";

    }

});