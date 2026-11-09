let viagens = JSON.parse(localStorage.getItem("viagens")) || [];

const lista = document.querySelector(".viagens");

function mostrarViagens() {

    lista.innerHTML = "";

    viagens.forEach(function(viagem, indice) {

        const card = document.createElement("div");

        card.classList.add("viagem");

        if (viagem.concluida) {
            card.classList.add("concluida");
        }

        card.innerHTML = `
            <h2>${viagem.nome}</h2>

            <p><strong>Destino:</strong> ${viagem.destino}</p>

            <p><strong>Orçamento:</strong> R$ ${viagem.orcamento}</p>

            <p><strong>Data de início:</strong> ${viagem.dataInicio}</p>

            <p><strong>Data de fim:</strong> ${viagem.dataFim}</p>

            <p><strong>Descrição:</strong> ${viagem.descricao}</p>

            ${
                viagem.concluida
                ? `<p class="status">✓ Viagem concluída</p>`
                : ``
            }

            <div class="acoes">

                ${
                    viagem.concluida
                    ? ``
                    : `<button class="concluir" onclick="concluirViagem(${indice})">
                        ✓ Concluir
                    </button>`
                }

                <button class="apagar" onclick="apagarViagem(${indice})">
                    🗑 Apagar
                </button>

            </div>
        `;

        lista.appendChild(card);
    });
}


function concluirViagem(indice) {

    viagens[indice].concluida = true;

    localStorage.setItem("viagens", JSON.stringify(viagens));

    mostrarViagens();
}


function apagarViagem(indice) {

    const confirmar = confirm("Tem certeza que deseja apagar esta viagem?");

    if (confirmar) {

        viagens.splice(indice, 1);

        localStorage.setItem("viagens", JSON.stringify(viagens));

        mostrarViagens();
    }
}


mostrarViagens();