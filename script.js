import { initHeader } from './js/header.js';
import { initSearchBar } from './js/barra-busqueda.js';
import { initPopularMovies, fetchPopularMovies } from './js/pelis-populares.js';
import { initGenreMovies, renderGenresSections } from './js/pelis-genero.js';

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

// Importar el módulo CineBot
import { loadCinebot } from './js/cinebot-loader.js';

// Esperar a que el DOM esté listo
window.addEventListener("DOMContentLoaded", () => {
  // Cargar componentes de forma dinámica
  includeHTML("header", "header.html", () => {
    console.log("✅ header.html cargado");
    initHeader(); // Inicializa el header después de cargarlo
  });
  
  includeHTML("#search-container", "nav.html");
  includeHTML("#favoritos", "favoritos.html");
  includeHTML("footer", "footer.html");
  
  // Cargar el componente CineBot
  loadCinebot().then(() => {
    console.log("✅ CineBot cargado correctamente");
  }).catch(error => {
    console.error("❌ Error al cargar CineBot:", error);
  });

  
  includeHTML("main", "main.html", () => {
    console.log("✅ main.html cargado");

    // Ejecutar funciones de inicialización
    initSearchBar();
    initPopularMovies();
    initGenreMovies();

    // Esperar a que los elementos estén disponibles
    retryFunction(fetchPopularMovies, "#slider");
    retryFunction(renderGenresSections, "#genres");
  });
});

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const div = document.querySelector('.header');

  if (scrollY > 100) {
    div.style.backgroundColor = 'black';
    div.style.borderBottom = '2px solid #00F5C8';
  } else {
    div.style.backgroundColor = 'transparent';
    div.style.borderBottom = '0px'; // Color original
  }
});

// Define una función para cambiar el número de caracteres mostrados en función del tamaño de la ventana
function adjustOverviewLength() {
  const overviewElements = document.querySelectorAll('.slide-info p');

  // Define la longitud máxima de caracteres para pantallas grandes y pequeñas
  const maxLengthLarge = 1000;
  const maxLengthSmall = 300;

  // Obtén el tamaño de la ventana
  const isSmallScreen = window.innerWidth < 768;  // Esto lo puedes ajustar a tu preferencia

  // Ajusta el contenido de acuerdo con el tamaño de la pantalla
  overviewElements.forEach(element => {
      const originalText = element.textContent || element.innerText;
      const maxLength = isSmallScreen ? maxLengthSmall : maxLengthLarge;

      element.textContent = originalText.length > maxLength ? originalText.substring(0, maxLength) + '...' : originalText;
  });
}

// Llama a la función cuando se cargue la página o cuando se cambie el tamaño de la ventana
window.addEventListener('load', adjustOverviewLength);
window.addEventListener('resize', adjustOverviewLength);
