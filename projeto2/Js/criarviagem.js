const formulario = document.querySelector("form");

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    let nome = document.getElementById("nome").value;
    let orcamento = document.getElementById("orcamento").value;
    let dataInicio = document.getElementById("data_inicio").value;
    let dataFim = document.getElementById("data_fim").value;
    let destino = document.getElementById("destino").value;
    let descricao = document.getElementById("descricao").value;

    let viagem = {
        nome: nome,
        orcamento: orcamento,
        dataInicio: dataInicio,
        dataFim: dataFim,
        destino: destino,
        descricao: descricao
    };

    let viagens = JSON.parse(localStorage.getItem("viagens")) || [];

    viagens.push(viagem);

    localStorage.setItem("viagens", JSON.stringify(viagens));

    alert("Viagem criada com sucesso!");

    window.location.href = "minhasviagens.html";
});