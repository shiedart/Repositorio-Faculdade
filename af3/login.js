const lanlogin = [
    { login: 'gerente', senha: 'gerente123', pagina: 'gerente.html' },
    { login: 'funcionario1', senha: 'funcionario10', pagina: 'funcionario.html' }
];

$(document).ready(function() {

    $('#loginform').on('submit', function(event) {
        event.preventDefault(); 

        const loginDigitado = $('#login').val().trim();
        const senhaDigitada = $('#senha').val().trim();

        const usuarioEncontrado = lanlogin.find(user => 
            user.login === loginDigitado && user.senha === senhaDigitada
        );

        if (usuarioEncontrado) {
            window.location.href = usuarioEncontrado.pagina;
        }
    });
});
