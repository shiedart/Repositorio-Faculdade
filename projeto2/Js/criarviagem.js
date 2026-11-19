"use strict";

const formulario = document.getElementById("trip-form");
const campoDestino = document.getElementById("destino");
const campoDataInicio = document.getElementById("data_inicio");
const campoDataFim = document.getElementById("data_fim");
const campoOrcamento = document.getElementById("orcamento");
const campoParticipantes = document.getElementById("participantes");
const campoDescricao = document.getElementById("descricao");
const mensagemErro = document.getElementById("form-error");
const contadorDescricao = document.getElementById("description-count");
const previewOrcamento = document.getElementById("budget-preview");
const idEdicao = new URLSearchParams(window.location.search).get("editar");
const viagensAtuais = JSON.parse(localStorage.getItem("viagens") || "[]");
const viagemEditando = idEdicao ? viagensAtuais.find((item) => String(item.id) === idEdicao) : null;

const destinoSugerido = new URLSearchParams(window.location.search).get("destino");
if (idEdicao && !viagemEditando) {
  mensagemErro.textContent = "Não foi possível localizar essa viagem para editar.";
  document.querySelector(".submit-trip").disabled = true;
} else if (viagemEditando) {
  document.getElementById("nome").value = viagemEditando.nome || "";
  campoDestino.value = viagemEditando.destino || "";
  campoDataInicio.value = viagemEditando.dataInicio || "";
  campoDataFim.value = viagemEditando.dataFim || "";
  campoOrcamento.value = viagemEditando.orcamento || "";
  campoParticipantes.value = viagemEditando.participantes || 1;
  document.getElementById("transporte").value = viagemEditando.transporte || "";
  document.getElementById("hospedagem").value = viagemEditando.hospedagem || "";
  campoDescricao.value = viagemEditando.descricao || "";
  document.querySelector("#form-title").textContent = "Editar planejamento";
  document.querySelector(".submit-trip").textContent = "Salvar alterações";
  contadorDescricao.textContent = campoDescricao.value.length;
} else if (destinoSugerido) {
  campoDestino.value = destinoSugerido;
}

const hoje = new Date();
const dataLocal = new Date(hoje.getTime() - hoje.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
campoDataInicio.min = viagemEditando?.dataInicio || dataLocal;
campoDataFim.min = viagemEditando?.dataInicio || dataLocal;

campoDataInicio.addEventListener("change", () => {
  campoDataFim.min = campoDataInicio.value || dataLocal;
  if (campoDataFim.value && campoDataFim.value < campoDataInicio.value) campoDataFim.value = "";
  campoDataFim.setCustomValidity("");
});

campoDataFim.addEventListener("change", () => campoDataFim.setCustomValidity(""));
campoDescricao.addEventListener("input", () => {
  contadorDescricao.textContent = campoDescricao.value.length;
});

function atualizarEstimativa() {
  const total = Number(campoOrcamento.value || 0) * Number(campoParticipantes.value || 0);
  previewOrcamento.textContent = `Estimativa total do grupo: ${total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;
}
campoOrcamento.addEventListener("input", atualizarEstimativa);
campoParticipantes.addEventListener("input", atualizarEstimativa);
atualizarEstimativa();

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  mensagemErro.textContent = "";

  if (campoDataFim.value < campoDataInicio.value) {
    campoDataFim.setCustomValidity("A data de volta deve ser igual ou posterior à data de ida.");
    campoDataFim.reportValidity();
    return;
  }

  const viagem = {
    id: viagemEditando?.id || (window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`),
    nome: document.getElementById("nome").value.trim(),
    destino: campoDestino.value.trim(),
    dataInicio: campoDataInicio.value,
    dataFim: campoDataFim.value,
    orcamento: Number(campoOrcamento.value),
    orcamentoTotal: Number(campoOrcamento.value) * Number(campoParticipantes.value),
    participantes: Number(campoParticipantes.value),
    transporte: document.getElementById("transporte").value,
    hospedagem: document.getElementById("hospedagem").value.trim(),
    descricao: campoDescricao.value.trim(),
    roteiro: viagemEditando?.roteiro || [],
    compras: viagemEditando?.compras || [],
    concluida: false,
    avaliacao: null,
    criadaEm: new Date().toISOString()
  };

  try {
    const viagensSalvas = JSON.parse(localStorage.getItem("viagens") || "[]");
    const indiceEdicao = viagemEditando ? viagensSalvas.findIndex((item) => String(item.id) === idEdicao) : -1;
    if (indiceEdicao >= 0) {
      viagem.concluida = viagensSalvas[indiceEdicao].concluida;
      viagem.avaliacao = viagensSalvas[indiceEdicao].avaliacao || null;
      viagem.criadaEm = viagensSalvas[indiceEdicao].criadaEm;
      viagensSalvas[indiceEdicao] = viagem;
    } else {
      viagem.criadaEm = new Date().toISOString();
      viagensSalvas.push(viagem);
    }
    localStorage.setItem("viagens", JSON.stringify(viagensSalvas));
    const estado = viagemEditando ? "editada=1" : "nova=1";
    window.location.href = `roteiro-viagem.html?id=${encodeURIComponent(viagem.id)}&${estado}`;
  } catch (erro) {
    mensagemErro.textContent = "Não foi possível salvar a viagem neste navegador. Verifique o espaço disponível e tente novamente.";
  }
});
