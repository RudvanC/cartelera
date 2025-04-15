// ========================================================================================================================
// Importaciones de módulos
// ========================================================================================================================
import { initHeader } from './js/header.js';
// El módulo barra-busqueda.js maneja la funcionalidad de búsqueda
import { initSearchBar } from './js/barra-busqueda.js';
// El módulo pelis-populares.js maneja la sección de películas populares
import { initPopularMovies, fetchPopularMovies } from './js/pelis-populares.js';
// El módulo pelis-genero.js maneja la sección de películas por género
import { initGenreMovies, renderGenresSections } from './js/pelis-genero.js';
import { loadCinebot } from './js/cinebot-loader.js';


// ========================================================================================================================
// Carga dinámica de HTML
// ========================================================================================================================
function includeHTML(element, file, callback) {
  // Hacemos una petición para obtener el archivo HTML
  fetch(`./components/${file}`)
    .then(response => {
      // Verificamos si la respuesta es exitosa
      if (!response.ok) throw new Error(`Error ${response.status}`);
      return response.text();
    })
    .then(data => {
      // Buscamos el elemento donde insertaremos el contenido
      const targetElement = document.querySelector(element);
      if (targetElement) {
        // Insertamos el contenido HTML
        targetElement.innerHTML = data;
        if (callback) callback(); // Ejecutar callback si existe
      } else {
        console.error(`❌ No se encontró el elemento: ${element}`);
      }
    })
    .catch(error => console.error(`❌ Error cargando ${file}:`, error));
}


// ========================================================================================================================
// Inicialización al cargar el DOM
// ========================================================================================================================
window.addEventListener("DOMContentLoaded", () => {
  // Header
  includeHTML("header", "header.html", initHeader);

  // Otros componentes
  includeHTML("#search-container", "nav.html", () => {
    // Initialize search bar after nav.html is loaded
    initSearchBar();
  });
  includeHTML("footer", "footer.html");

  // Main + inicialización de funciones
  includeHTML("main", "main.html", () => {
    initPopularMovies();
    initGenreMovies();

  });

  // CineBot
  loadCinebot().catch(error => {
    console.error("❌ Error al cargar CineBot:", error);
  });
});


// ========================================================================================================================
// Ajuste de estilo al hacer scroll
// ========================================================================================================================
window.addEventListener('scroll', () => {
  const div = document.querySelector('.header');
  if (!div) return; // Seguridad por si el header aún no está cargado

  const scrollY = window.scrollY;
  if (scrollY > 100) {
    div.style.backgroundColor = '#324A45';
    div.style.borderBottom = '2px solid #00F5C8';
  } else {
    div.style.backgroundColor = 'transparent';
    div.style.borderBottom = '0px';
  }
});


// ========================================================================================================================
// Ajustar longitud del texto según pantalla
// ========================================================================================================================
// Esta función ajusta la longitud del texto según el tamaño de la pantalla
// Es útil para hacer el contenido más legible en diferentes dispositivos
function adjustOverviewLength() {
  // Seleccionamos todos los elementos que contienen descripciones
  const overviewElements = document.querySelectorAll('.slide-info p');

  // Definimos los límites de caracteres según el tamaño de pantalla
  const maxLengthLarge = 1000;    // Máximo de caracteres en pantallas grandes
  const maxLengthSmall = 100;     // Máximo de caracteres en pantallas pequeñas

  // Verificamos si estamos en una pantalla pequeña (menos de 768px)
  const isSmallScreen = window.innerWidth < 768;

  // Ajustamos el texto para cada elemento
  overviewElements.forEach(element => {
      const originalText = element.textContent || element.innerText;
      const maxLength = isSmallScreen ? maxLengthSmall : maxLengthLarge;

      // Recortamos el texto si es necesario y agregamos puntos suspensivos
      element.textContent = originalText.length > maxLength ? originalText.substring(0, maxLength) + '...' : originalText;
  });
}

// Ejecutamos la función de ajuste de texto en dos momentos:
window.addEventListener('load', adjustOverviewLength);     // Cuando la página termina de cargar
window.addEventListener('resize', adjustOverviewLength);   // Cuando se cambia el tamaño de la ventana