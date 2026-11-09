const botaoDarkMode = document.getElementById("darkModeToggle");


if (botaoDarkMode) {

   
    const temaSalvo = localStorage.getItem("tema");

    if (temaSalvo === "escuro") {
        document.body.classList.add("dark-mode");
        botaoDarkMode.textContent = "☀️";
        botaoDarkMode.setAttribute("aria-label", "Ativar modo claro");
    }


    botaoDarkMode.addEventListener("click", function() {

        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            botaoDarkMode.textContent = "☀️";
            botaoDarkMode.setAttribute("aria-label", "Ativar modo claro");
            localStorage.setItem("tema", "escuro");

        } else {
            botaoDarkMode.textContent = "🌙";
            botaoDarkMode.setAttribute("aria-label", "Ativar modo escuro");
            localStorage.setItem("tema", "claro");
        }

    });
}