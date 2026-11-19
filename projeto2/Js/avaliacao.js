const initialReviews = [
  {
    name: "Ana Souza", initials: "AS", rating: 5, date: "12/09/2025",
    comment: "Foi uma viagem incrível! Tudo muito bem organizado, o grupo super animado e os lugares são simplesmente maravilhosos. Com certeza quero repetir!"
  },
  {
    name: "Carlos Mendes", initials: "CM", rating: 5, date: "12/09/2025",
    comment: "Amei cada momento! O roteiro foi perfeito, conseguimos conhecer vários pontos turísticos e ainda tivemos tempo para relaxar. Recomendo demais!"
  },
  {
    name: "Juliana Costa", initials: "JC", rating: 4, date: "11/09/2025",
    comment: "A experiência foi muito boa, mas acho que faltou um pouco mais de tempo livre no centro. De resto, tudo excelente!"
  },
  {
    name: "Rafael Lima", initials: "RL", rating: 5, date: "11/09/2025",
    comment: "Viagem perfeita! O guia foi incrível, os passeios foram muito bem planejados e o grupo fez toda a diferença. Já quero a próxima!"
  }
];

let selectedRating = 0;
let reviews = [...initialReviews];

const starButtons = [...document.querySelectorAll(".star-button")];
const ratingLabel = document.getElementById("rating-label");
const commentInput = document.getElementById("comment");
const form = document.getElementById("review-form");
const formError = document.getElementById("form-error");
const charCount = document.getElementById("char-count");
const reviewsList = document.getElementById("reviews-list");
const averageScore = document.getElementById("average-score");
const reviewCount = document.getElementById("review-count");
const successMessage = document.getElementById("success-message");

const ratingDescriptions = {
  1: "1 de 5 estrelas — Ruim",
  2: "2 de 5 estrelas — Poderia melhorar",
  3: "3 de 5 estrelas — Boa",
  4: "4 de 5 estrelas — Muito boa",
  5: "5 de 5 estrelas — Excelente"
};

function paintStars(rating, preview = false) {
  starButtons.forEach((button) => {
    const value = Number(button.dataset.rating);
    button.classList.toggle("selected", !preview && value <= selectedRating);
    button.classList.toggle("preview", preview && value <= rating);
    button.setAttribute("aria-pressed", String(!preview && value === selectedRating));
  });
}

starButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedRating = Number(button.dataset.rating);
    paintStars(selectedRating);
    ratingLabel.textContent = ratingDescriptions[selectedRating];
    formError.textContent = "";
  });
  button.addEventListener("mouseenter", () => paintStars(Number(button.dataset.rating), true));
  button.addEventListener("focus", () => paintStars(Number(button.dataset.rating), true));
});
document.querySelector(".rating-picker").addEventListener("mouseleave", () => paintStars(selectedRating));
document.querySelector(".rating-picker").addEventListener("focusout", () => {
  window.setTimeout(() => {
    if (!document.querySelector(".rating-picker").contains(document.activeElement)) paintStars(selectedRating);
  }, 0);
});

commentInput.addEventListener("input", () => {
  charCount.textContent = `${commentInput.value.length}/500`;
  if (commentInput.value.trim()) formError.textContent = "";
});

function renderReviews() {
  reviewsList.replaceChildren();
  if (reviews.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Ainda não há avaliações para esta viagem.";
    reviewsList.appendChild(empty);
  } else {
    reviews.forEach((review) => {
      const item = document.createElement("article");
      item.className = "review-item";

      const avatar = document.createElement("div");
      avatar.className = "avatar avatar-review";
      avatar.setAttribute("aria-hidden", "true");
      avatar.textContent = review.initials;

      const person = document.createElement("div");
      person.className = "review-person";
      const name = document.createElement("strong");
      name.textContent = review.name;
      const badge = document.createElement("span");
      badge.className = "participant-badge";
      badge.textContent = "Participante";
      person.append(name, badge);

      const body = document.createElement("div");
      body.className = "review-body";
      const meta = document.createElement("div");
      meta.className = "review-meta";
      const stars = document.createElement("span");
      stars.className = "review-stars";
      stars.setAttribute("aria-label", `${review.rating} de 5 estrelas`);
      stars.textContent = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
      const date = document.createElement("span");
      date.className = "review-date";
      date.textContent = review.date;
      meta.append(stars, date);

      const comment = document.createElement("p");
      comment.className = "review-comment";
      comment.textContent = review.comment;
      body.append(meta, comment);
      item.append(avatar, person, body);
      reviewsList.appendChild(item);
    });
  }

  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
  averageScore.textContent = reviews.length ? average.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : "—";
  reviewCount.textContent = String(reviews.length);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formError.textContent = "";
  successMessage.hidden = true;

  if (selectedRating < 1 || selectedRating > 5) {
    formError.textContent = "Selecione uma nota de 1 a 5 estrelas.";
    ratingLabel.textContent = "Você ainda não selecionou uma nota";
    return;
  }

  const comment = commentInput.value.trim();
  if (!comment) {
    formError.textContent = "Escreva um comentário antes de enviar.";
    commentInput.focus();
    return;
  }

  const initials = "VC";
  reviews.unshift({
    name: "Você (demonstração)",
    initials,
    rating: selectedRating,
    date: new Date().toLocaleDateString("pt-BR"),
    comment
  });
  renderReviews();
  successMessage.hidden = false;
  successMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });

  form.reset();
  selectedRating = 0;
  paintStars(0);
  ratingLabel.textContent = "Selecione sua nota";
  charCount.textContent = "0/500";
  formError.textContent = "";
});

renderReviews();
