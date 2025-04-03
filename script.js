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
        .catch(error => console.error(`❌ Error cargando ${file}`, error));
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

// Función para esperar que un elemento exista antes de ejecutar la función
function retryFunction(fn, selector, attempts = 15, delay = 500) {
    let count = 0;
    const interval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(interval);
            console.log(`✅ Elemento ${selector} encontrado`);
            fn();
        } else if (++count >= attempts) {
            clearInterval(interval);
            console.error(`❌ Error: No se encontró ${selector} después de ${attempts} intentos`);
        }
    }, delay);
}

// Función para cargar un script dinámicamente
function loadScript(src, callback) {
    const script = document.createElement("script");
    script.src = src;
    script.onload = callback;
    script.onerror = () => console.error(`❌ Error cargando ${src}`);
    document.body.appendChild(script);
}
