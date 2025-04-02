function includeHTML(element, file, callback) {
    fetch("./components/" + file)
        .then(response => response.text())
        .then(data => {
            document.querySelector(element).innerHTML = data;
            if (callback) {
                // Dar tiempo para que el DOM se actualice
                setTimeout(callback, 100);
            }
        })
        .catch(error => console.error("❌ Error cargando " + file, error));
}

window.addEventListener("DOMContentLoaded", () => {
    // Cargar componentes en orden
    includeHTML("header", "header.html", () => {
        includeHTML("nav", "nav.html", () => {
            includeHTML("main", "main.html", () => {
                // Inicializar scripts solo después de que el DOM esté listo
                if (typeof initSearchBar === 'function') initSearchBar();
                if (typeof initPopularMovies === 'function') initPopularMovies();
                if (typeof initGenreMovies === 'function') initGenreMovies();
            });
        });
    });
    includeHTML("footer", "footer.html");
});