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
 

    includeHTML("main", "main.html", async () => {
        console.log("✅ main.html cargado");

        // Esperar un momento para asegurarnos de que el contenido está en el DOM
        setTimeout(async () => {
            const contenedorPeliculas = document.getElementById("peliculas-container");

            if (contenedorPeliculas) {
                console.log("✅ #peliculas-container encontrado en el DOM");

                // Importar y ejecutar el script manualmente
                const { obtenerPeliculas } = await import("./js/API-mostrar-peliculas.js");
                obtenerPeliculas();
            } else {
                console.error("❌ #peliculas-container NO encontrado");
            }
        }, 500);
    });

    includeHTML("footer", "footer.html");
});
