function includeHTML(element, file, callback) {
    fetch("./components/" + file) // Ajusta la ruta si es necesario
        .then(response => response.text())
        .then(data => {
            document.querySelector(element).innerHTML = data;
            if (callback) callback();
        })
        .catch(error => console.error("❌ Error cargando " + file, error));
}

window.addEventListener("DOMContentLoaded", () => {
    includeHTML("header", "header.html");
    includeHTML("nav", "nav.html");
    includeHTML("main", "main.html", () => {
        // Una vez que main.html se haya cargado, se cargan las películas
        fetchPopularMovies();
    });
    includeHTML("footer", "footer.html");
});