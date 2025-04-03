function includeHTML(element, file, callback) {
    fetch(`./components/${file}`)
        .then(response => {
            if (!response.ok) throw new Error(`Error ${response.status}`);
            return response.text();
        })
        .then(data => {
            const targetElement = document.querySelector(element);
            if (targetElement) {
                targetElement.innerHTML = data;
                if (callback) callback();
            } else {
                console.error(`❌ No se encontró el elemento: ${element}`);
            }
        })
        .catch(error => console.error(`❌ Error cargando ${file}:`, error));
}

// Función para cargar scripts dinámicamente
function loadScript(src, callback) {
    const script = document.createElement("script");
    script.src = src;
    script.onload = callback;
    script.onerror = () => console.error(`❌ Error cargando ${src}`);
    document.body.appendChild(script);
}

// Esperar a que el DOM esté listo
window.addEventListener("DOMContentLoaded", () => {
    includeHTML("header", "header.html");
    includeHTML("#search-container", "nav.html");
    includeHTML("footer", "footer.html");

    // Cargar main.html y ejecutar scripts relacionados
    includeHTML("main", "main.html", () => {
        console.log("✅ main.html cargado");

        // Verifica si las funciones existen antes de llamarlas
        if (typeof initSearchBar === "function") initSearchBar();
        if (typeof initPopularMovies === "function") initPopularMovies();
        if (typeof initGenreMovies === "function") initGenreMovies();

        // Cargar scripts dinámicamente
        loadScript("./js/pelis-populares.js", () => {
            console.log("✅ pelis-populares.js cargado");
            retryFunction(fetchPopularMovies, "#slider");
        });

        loadScript("./js/pelis-genero.js", () => {
            console.log("✅ pelis-genero.js cargado");
            retryFunction(renderGenresSections, "#genres");
        });
    });
});

// Función para esperar que un elemento exista antes de ejecutar una función
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
