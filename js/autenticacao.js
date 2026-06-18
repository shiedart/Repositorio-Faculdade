function verificarLogin() {

    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuarioLogado) {
        alert("Cadastre-se e faça login para continuar.");
        window.location.href = "cadastro.html";
        return null;
    }

    return usuarioLogado;
}

verificarLogin();