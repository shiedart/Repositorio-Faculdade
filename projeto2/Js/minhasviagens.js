"use strict";

const listaViagens = document.querySelector(".viagens");
let viagens = JSON.parse(localStorage.getItem("viagens") || "[]");
let filtroAtual = "todas";
let adicionouIds = false;
viagens.forEach((viagem, indice) => {
  if (!viagem.id) {
    viagem.id = `viagem-legada-${indice}-${Date.now()}`;
    adicionouIds = true;
  }
});
if (adicionouIds) localStorage.setItem("viagens", JSON.stringify(viagens));

function criarTexto(tag, texto, classe) {
  const elemento = document.createElement(tag);
  elemento.textContent = texto;
  if (classe) elemento.className = classe;
  return elemento;
}

function formatarData(data) {
  if (!data) return "Data não informada";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${data}T00:00:00Z`));
}

function atualizarContagens() {
  document.querySelector('[data-count="todas"]').textContent = viagens.length;
  document.querySelector('[data-count="planejamento"]').textContent = viagens.filter((viagem) => !viagem.concluida).length;
  document.querySelector('[data-count="concluidas"]').textContent = viagens.filter((viagem) => viagem.concluida).length;
}

function salvarViagens() {
  localStorage.setItem("viagens", JSON.stringify(viagens));
  mostrarViagens();
}

function mostrarViagens() {
  listaViagens.replaceChildren();
  atualizarContagens();
  const filtradas = viagens.map((viagem, indice) => ({ viagem, indice }))
    .filter(({ viagem }) => filtroAtual === "todas" || (filtroAtual === "concluidas" ? viagem.concluida : !viagem.concluida));

  if (!filtradas.length) {
    const texto = viagens.length === 0 ? "Você ainda não criou viagens. Comece planejando sua próxima aventura!"
      : filtroAtual === "concluidas" ? "Ainda não há viagens concluídas."
        : "Não há viagens em planejamento.";
    const vazio = criarTexto("p", texto, "empty-state");
    if (filtroAtual !== "concluidas") {
      const link = document.createElement("a");
      link.href = "criarviagem.html";
      link.className = "trip-action";
      link.textContent = "Planejar uma viagem";
      vazio.append(document.createElement("br"), link);
    }
    listaViagens.append(vazio);
    return;
  }

  filtradas.forEach(({ viagem, indice }) => {
    const cartao = document.createElement("article");
    cartao.className = `viagem${viagem.concluida ? " concluida" : ""}`;
    const topo = document.createElement("div");
    topo.className = "trip-card-top";
    topo.append(criarTexto("span", viagem.concluida ? "Concluída" : "Em planejamento", `trip-badge${viagem.concluida ? " done" : ""}`));
    cartao.append(topo, criarTexto("h2", viagem.nome), criarTexto("p", `📍 ${viagem.destino}`, "trip-destination"));

    const detalhes = document.createElement("dl");
    detalhes.className = "trip-details-list";
    const campos = [
      ["Datas", `${formatarData(viagem.dataInicio)} – ${formatarData(viagem.dataFim)}`],
      ["Grupo", `${viagem.participantes || 1} ${Number(viagem.participantes) === 1 ? "pessoa" : "pessoas"}`],
      ["Orçamento por pessoa", Number(viagem.orcamento || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })],
      ["Transporte", viagem.transporte || "A definir"]
    ];
    if (viagem.orcamentoTotal || viagem.participantes) campos.push(["Estimativa do grupo", Number(viagem.orcamentoTotal ?? (Number(viagem.orcamento || 0) * Number(viagem.participantes || 1))).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })]);
    if (viagem.hospedagem) campos.push(["Hospedagem", viagem.hospedagem]);
    campos.forEach(([rotulo, valor]) => {
      const item = document.createElement("div");
      item.append(criarTexto("dt", rotulo), criarTexto("dd", valor));
      detalhes.append(item);
    });
    cartao.append(detalhes, criarTexto("p", viagem.descricao, "trip-description"));

    const acoes = document.createElement("div");
    acoes.className = "acoes";
    const avaliar = document.createElement("a");
    avaliar.className = "trip-action-button";
    avaliar.href = `avaliar-viagem.html?id=${encodeURIComponent(viagem.id || indice)}`;
    avaliar.textContent = viagem.concluida ? (viagem.avaliacao ? `Ver avaliação · ${viagem.avaliacao.nota}/5 ★` : "Avaliar viagem") : "Concluir e avaliar";
    acoes.append(avaliar);

    const roteiro = document.createElement("a");
    roteiro.className = "trip-edit-link";
    roteiro.href = `roteiro-viagem.html?id=${encodeURIComponent(viagem.id || indice)}`;
    roteiro.textContent = `Roteiro (${(viagem.roteiro || []).length})`;
    acoes.append(roteiro);

    if (!viagem.concluida) {
      const editar = document.createElement("a");
      editar.className = "trip-edit-link";
      editar.href = `criarviagem.html?editar=${encodeURIComponent(viagem.id || indice)}`;
      editar.textContent = "Editar";
      acoes.append(editar);
    }

    const apagar = criarTexto("button", "Apagar", "apagar");
    apagar.type = "button";
    apagar.addEventListener("click", () => {
      if (!window.confirm(`Apagar “${viagem.nome}”? Esta ação não pode ser desfeita.`)) return;
      viagens.splice(indice, 1);
      salvarViagens();
    });
    acoes.append(apagar);
    cartao.append(acoes);
    listaViagens.append(cartao);
  });
}

document.querySelectorAll("[data-filter]").forEach((botao) => {
  botao.addEventListener("click", () => {
    filtroAtual = botao.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((aba) => aba.setAttribute("aria-pressed", String(aba === botao)));
    mostrarViagens();
  });
});

const parametros = new URLSearchParams(window.location.search);
if (parametros.get("criada") === "1" || parametros.get("atualizada") === "1" || parametros.get("concluida") === "1") {
  const textoAviso = parametros.get("atualizada") === "1" ? "Alterações salvas no planejamento."
    : parametros.get("concluida") === "1" ? "Viagem concluída. Obrigado por registrar sua experiência!"
      : "Viagem salva! Ela já está disponível no seu planejamento.";
  const aviso = criarTexto("p", textoAviso, "trip-notice");
  document.querySelector(".trips-heading").after(aviso);
}

mostrarViagens();
