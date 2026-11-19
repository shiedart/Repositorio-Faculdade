"use strict";

const viagens = JSON.parse(localStorage.getItem("viagens") || "[]");
const idViagem = new URLSearchParams(window.location.search).get("id");
const indiceViagem = viagens.findIndex((item) => String(item.id) === idViagem);
const viagem = viagens[indiceViagem];
const listaPasseios = document.getElementById("activity-list");
const listaCompras = document.getElementById("shopping-list");
const statusSalvamento = document.getElementById("save-status");
const formularioPasseio = document.getElementById("activity-form");
const formularioCompras = document.getElementById("shopping-form");

function novoId() {
  return window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function criarElemento(tag, texto, classe) {
  const elemento = document.createElement(tag);
  elemento.textContent = texto;
  if (classe) elemento.className = classe;
  return elemento;
}

function formatarData(data) {
  if (!data) return "Data não informada";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${data}T00:00:00Z`));
}

function persistir(mensagem = "Alterações salvas automaticamente.") {
  try {
    localStorage.setItem("viagens", JSON.stringify(viagens));
    statusSalvamento.textContent = mensagem;
  } catch (erro) {
    statusSalvamento.textContent = "Não foi possível salvar. Confira o espaço disponível no navegador.";
  }
}

function renderizarPasseios() {
  const passeios = [...(viagem.roteiro || [])].sort((a, b) => `${a.data}${a.horario || ""}`.localeCompare(`${b.data}${b.horario || ""}`));
  listaPasseios.replaceChildren();
  document.getElementById("activity-count").textContent = `${passeios.length} ${passeios.length === 1 ? "passeio" : "passeios"}`;
  if (!passeios.length) {
    listaPasseios.append(criarElemento("p", "Adicione os passeios que vocês querem fazer. O roteiro aparecerá aqui por data.", "planner-empty"));
    return;
  }

  passeios.forEach((passeio) => {
    const item = document.createElement("article");
    item.className = "activity-item";
    const informacao = document.createElement("div");
    informacao.className = "activity-information";
    informacao.append(criarElemento("p", formatarData(passeio.data), "activity-date"));
    informacao.append(criarElemento("h3", passeio.nome));
    if (passeio.horario) informacao.append(criarElemento("p", passeio.horario, "activity-time"));
    if (passeio.observacoes) informacao.append(criarElemento("p", passeio.observacoes, "activity-notes"));
    const remover = criarElemento("button", "Remover", "remove-item");
    remover.type = "button";
    remover.setAttribute("aria-label", `Remover ${passeio.nome} do roteiro`);
    remover.addEventListener("click", () => {
      viagem.roteiro = viagem.roteiro.filter((registro) => registro.id !== passeio.id);
      persistir("Passeio removido e alterações salvas.");
      renderizarPasseios();
    });
    item.append(informacao, remover);
    listaPasseios.append(item);
  });
}

function renderizarCompras() {
  const itens = viagem.compras || [];
  const comprados = itens.filter((item) => item.comprado).length;
  document.getElementById("shopping-count").textContent = `${comprados}/${itens.length}`;
  listaCompras.replaceChildren();
  if (!itens.length) {
    listaCompras.append(criarElemento("li", "Sua lista está vazia. Adicione o que o grupo precisa comprar ou levar.", "planner-empty"));
    return;
  }

  itens.forEach((produto) => {
    const item = document.createElement("li");
    item.className = `shopping-item${produto.comprado ? " purchased" : ""}`;
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(produto.comprado);
    checkbox.addEventListener("change", () => {
      produto.comprado = checkbox.checked;
      persistir("Checklist atualizada.");
      renderizarCompras();
    });
    label.append(checkbox, criarElemento("span", produto.nome));
    const quantidade = criarElemento("span", `× ${produto.quantidade}`, "shopping-quantity");
    const remover = criarElemento("button", "×", "remove-item remove-shopping");
    remover.type = "button";
    remover.setAttribute("aria-label", `Remover ${produto.nome} da lista`);
    remover.addEventListener("click", () => {
      viagem.compras = viagem.compras.filter((registro) => registro.id !== produto.id);
      persistir("Item removido e alterações salvas.");
      renderizarCompras();
    });
    item.append(label, quantidade, remover);
    listaCompras.append(item);
  });
}

if (!viagem) {
  document.querySelector(".itinerary-heading h1").textContent = "Não encontramos essa viagem.";
  document.querySelector(".itinerary-heading p:last-child").textContent = "Volte à lista e abra o roteiro de uma viagem salva.";
  formularioPasseio.hidden = true;
  formularioCompras.hidden = true;
} else {
  viagem.roteiro = viagem.roteiro || [];
  viagem.compras = viagem.compras || [];
  document.getElementById("trip-summary").textContent = `${viagem.nome} · ${viagem.destino} · ${formatarData(viagem.dataInicio)} – ${formatarData(viagem.dataFim)}`;
  const campoDataPasseio = document.getElementById("activity-date");
  campoDataPasseio.min = viagem.dataInicio || "";
  campoDataPasseio.max = viagem.dataFim || "";
  renderizarPasseios();
  renderizarCompras();
  persistir(new URLSearchParams(window.location.search).has("nova") ? "Viagem criada. Comece adicionando passeios e itens para o grupo." : "Roteiro carregado. As alterações serão salvas automaticamente.");
}

formularioPasseio.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!viagem) return;
  const dados = new FormData(formularioPasseio);
  viagem.roteiro.push({
    id: novoId(),
    nome: String(dados.get("nome")).trim(),
    data: String(dados.get("data")),
    horario: String(dados.get("horario") || ""),
    observacoes: String(dados.get("observacoes") || "").trim()
  });
  persistir("Passeio adicionado ao roteiro.");
  formularioPasseio.reset();
  renderizarPasseios();
});

formularioCompras.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!viagem) return;
  const dados = new FormData(formularioCompras);
  viagem.compras.push({
    id: novoId(),
    nome: String(dados.get("nome")).trim(),
    quantidade: Number(dados.get("quantidade")),
    comprado: false
  });
  persistir("Item adicionado à checklist.");
  formularioCompras.reset();
  document.getElementById("shopping-quantity").value = "1";
  renderizarCompras();
});
