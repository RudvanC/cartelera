// Función para incluir contenido HTML de forma dinámica
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

// Esperar a que el DOM esté listo
window.addEventListener("DOMContentLoaded", () => {
  // Cargar componentes de forma dinámica
  includeHTML("header", "header.html", () => {
    console.log("✅ header.html cargado");
    initHeader(); // Inicializa el header después de cargarlo
  });
  
  includeHTML("#search-container", "nav.html");
  includeHTML("footer", "footer.html");
  
  // Carga el chatbot y su script
  includeHTML("#container", "chatbot.html", () => {
    console.log("✅ chatbot.html cargado");
    // Carga el script del chatbot
    loadScript("./js/movie-chatbot.js", () => {
      console.log("✅ movie-chatbot.js cargado");
      // Carga el script que inicializa la interfaz del chatbot
      loadScript("./chatbot-busqueda.js", () => {
        console.log("✅ chatbot-busqueda.js cargado");
        // En este punto ambos scripts deberían estar cargados
        // Si hay una función de inicialización específica, llámala aquí
        if (typeof initChatbot === "function") {
          initChatbot();
        }
      });
    });
  });

  includeHTML("main", "main.html", () => {
    console.log("✅ main.html cargado");

    // Ejecutar funciones de inicialización si están definidas
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

    // Opcional: Cargar barra de búsqueda si es necesaria
    loadScript("./js/barra-busqueda.js", () => {
      console.log("✅ barra-busqueda.js cargado");
      if (typeof initSearchBar === "function") initSearchBar();
    });
  });
});