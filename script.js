function includeHTML(element, file) {
    fetch("../components/" + file) // 🔹 Subimos un nivel antes de acceder a "componentes"
        .then(response => response.text())
        .then(data => {
            document.querySelector(element).innerHTML = data;
        })
        .catch(error => console.error("Error cargando " + file, error));
}

// Cargar el header y el footer cuando se cargue la página
window.addEventListener("DOMContentLoaded", () => {
    includeHTML("header", "header.html");
    includeHTML("nav", "nav.html");
    includeHTML("aside", "aside.html");
    includeHTML("main", "main.html");
    includeHTML("footer", "footer.html");
});
