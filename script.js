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
    includeHTML("header", "header.html");
    includeHTML("#search-container", "nav.html");
 
 
    // Carga el main y luego ejecuta los scripts cuando los elementos existan
    includeHTML("main", "main.html", () => {
        console.log("✅ main.html cargado");

         // Inicializar scripts solo después de que el DOM esté listo
         if (typeof initSearchBar === 'function') initSearchBar();
         if (typeof initPopularMovies === 'function') initPopularMovies();
         if (typeof initGenreMovies === 'function') initGenreMovies();
     });
 
 
        loadScript("../js/pelis-populares.js", () => {
            console.log("✅ pelis-populares.js cargado");
            retryFunction(fetchPopularMovies, "#slider");
        });
 
 
        loadScript("../js/pelis-genero.js", () => {
            console.log("✅ pelis-genero.js cargado");
            retryFunction(renderGenresSections, "#genres");
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
