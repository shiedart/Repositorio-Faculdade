const button = document.getElementById("modoEscuro");

if (localStorage.getItem("dark-mode") === "true") {
    document.body.classList.add("dark-mode");
    button.textContent = "☀️";
}

button.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");

    button.textContent = isDark ? "☀️" : "🌙";
    
    localStorage.setItem("dark-mode", isDark);
});
