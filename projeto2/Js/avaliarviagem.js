"use strict";

const viagens = JSON.parse(localStorage.getItem("viagens") || "[]");
const parametros = new URLSearchParams(window.location.search);
const idSolicitado = parametros.get("id");
const viagem = viagens.find((item) => String(item.id) === idSolicitado)
  || (idSolicitado !== null && /^\d+$/.test(idSolicitado) ? viagens[Number(idSolicitado)] : null);
const formulario = document.getElementById("review-form");
const botoesNota = [...document.querySelectorAll("[data-rating]")];
const mensagemErro = document.getElementById("review-error");
const status = document.getElementById("review-status");
let notaSelecionada = viagem?.avaliacao?.nota || 0;

function renderNota() {
  botoesNota.forEach((botao) => {
    const ativo = Number(botao.dataset.rating) <= notaSelecionada;
    botao.classList.toggle("selected", ativo);
    botao.setAttribute("aria-pressed", String(Number(botao.dataset.rating) === notaSelecionada));
  });
  const labels = ["", "Não foi uma boa viagem", "Poderia ter sido melhor", "Foi uma boa viagem", "Foi muito boa", "Foi incrível"];
  document.getElementById("rating-label").textContent = labels[notaSelecionada] || "Selecione de 1 a 5 estrelas";
}

function salvarConclusao(comAvaliacao) {
  if (!viagem) return;
  viagem.concluida = true;
  if (comAvaliacao) {
    viagem.avaliacao = {
      nota: notaSelecionada,
      comentario: document.getElementById("comment").value.trim(),
      recomendaria: document.getElementById("recomendaria").checked,
      data: new Date().toISOString()
    };
  }
  localStorage.setItem("viagens", JSON.stringify(viagens));
  status.textContent = comAvaliacao ? "Avaliação salva. Viagem concluída!" : "Viagem concluída sem avaliação.";
  window.setTimeout(() => { window.location.href = "minhas-viagens.html?concluida=1"; }, 700);
}

if (!viagem) {
  document.getElementById("review-trip-name").textContent = "Viagem não encontrada";
  document.getElementById("review-trip-destination").textContent = "Volte à lista de viagens e selecione uma viagem válida.";
  formulario.hidden = true;
} else {
  document.getElementById("review-trip-name").textContent = viagem.nome;
  document.getElementById("review-trip-destination").textContent = viagem.destino;
  const formatarData = (data) => data ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${data}T00:00:00Z`)) : "Data não informada";
  document.getElementById("review-trip-dates").textContent = `${formatarData(viagem.dataInicio)} – ${formatarData(viagem.dataFim)}`;
  if (viagem.avaliacao) {
    document.getElementById("comment").value = viagem.avaliacao.comentario || "";
    document.getElementById("comment-count").textContent = document.getElementById("comment").value.length;
    document.getElementById("recomendaria").checked = Boolean(viagem.avaliacao.recomendaria);
    document.querySelector(".review-submit").textContent = "Atualizar avaliação e concluir";
  }
}

botoesNota.forEach((botao) => botao.addEventListener("click", () => {
  notaSelecionada = Number(botao.dataset.rating);
  mensagemErro.textContent = "";
  renderNota();
}));

document.getElementById("comment").addEventListener("input", (event) => {
  document.getElementById("comment-count").textContent = event.target.value.length;
});

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!viagem) return;
  if (notaSelecionada < 1 || notaSelecionada > 5) {
    mensagemErro.textContent = "Escolha uma nota para salvar a avaliação.";
    return;
  }
  salvarConclusao(true);
});

document.getElementById("finish-without-review").addEventListener("click", () => salvarConclusao(false));
renderNota();
