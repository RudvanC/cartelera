// Importamos los módulos necesarios para cada funcionalidad de la página
// El módulo header.js maneja la funcionalidad del encabezado
import { initHeader } from './js/header.js';
// El módulo barra-busqueda.js maneja la funcionalidad de búsqueda
import { initSearchBar } from './js/barra-busqueda.js';
// El módulo pelis-populares.js maneja la sección de películas populares
import { initPopularMovies, fetchPopularMovies } from './js/pelis-populares.js';
// El módulo pelis-genero.js maneja la sección de películas por género
import { initGenreMovies, renderGenresSections } from './js/pelis-genero.js';

// Esta función carga contenido HTML de forma dinámica desde archivos externos
// Parámetros:
// - element: selector del elemento donde se insertará el contenido
// - file: nombre del archivo HTML a cargar
// - callback: función opcional que se ejecuta después de cargar el contenido
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
        // Si hay una función callback, la ejecutamos
        if (callback) callback();
      } else {
        console.error(`❌ No se encontró el elemento: ${element}`);
      }
    })
    .catch(error => console.error(`❌ Error cargando ${file}:`, error));
}

// Esta función intenta ejecutar una función cuando un elemento existe en el DOM
// Es útil para elementos que se cargan dinámicamente
// Parámetros:
// - fn: función a ejecutar
// - selector: elemento que debe existir
// - attempts: número de intentos (por defecto 15)
// - delay: tiempo entre intentos en milisegundos (por defecto 500)
function retryFunction(fn, selector, attempts = 15, delay = 500) {
  let count = 0;
  const interval = setInterval(() => {
    // Buscamos el elemento en el DOM
    const element = document.querySelector(selector);
    if (element) {
      // Si encontramos el elemento, detenemos el intervalo y ejecutamos la función
      clearInterval(interval);
      console.log(`✅ Elemento ${selector} encontrado`);
      fn();
    } else if (++count >= attempts) {
      // Si superamos el número de intentos, detenemos la búsqueda
      clearInterval(interval);
      console.error(`❌ Error: No se encontró ${selector} después de ${attempts} intentos`);
    }
  }, delay);
}

// Importamos el módulo del chatbot (CineBot)
import { loadCinebot } from './js/cinebot-loader.js';

// Esperamos a que el DOM esté completamente cargado antes de iniciar
window.addEventListener("DOMContentLoaded", () => {
  // Cargamos el encabezado y lo inicializamos
  includeHTML("header", "header.html", () => {
    console.log("✅ header.html cargado");
    initHeader(); // Inicializamos el header después de cargarlo
  });
  
  // Cargamos los componentes principales de la página
  includeHTML("#search-container", "nav.html");        // Barra de navegación
  includeHTML("#favoritos", "favoritos.html");         // Sección de favoritos
  includeHTML("footer", "footer.html");                // Pie de página
  
  // Cargamos e inicializamos el CineBot (chatbot)
  loadCinebot().then(() => {
    console.log("✅ CineBot cargado correctamente");
  }).catch(error => {
    console.error("❌ Error al cargar CineBot:", error);
  });

  // Cargamos el contenido principal
  includeHTML("main", "main.html", () => {
    console.log("✅ main.html cargado");

    // Inicializamos los componentes principales
    initSearchBar();         // Inicializa la barra de búsqueda
    initPopularMovies();     // Inicializa la sección de películas populares
    initGenreMovies();       // Inicializa la sección de películas por género

    // Esperamos que los elementos necesarios existan antes de cargar el contenido
    retryFunction(fetchPopularMovies, "#slider");      // Carga las películas populares en el slider
    retryFunction(renderGenresSections, "#genres");    // Carga las secciones de géneros
  });
});

<<<<<<< HEAD
// Si haces scroll, el fondo del .header cambia a negro.
=======
// Este evento controla el cambio de estilo del header al hacer scroll
>>>>>>> dev
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;                      // Posición actual del scroll
  const div = document.querySelector('.header');       // Elemento del header

  // Cambiamos el estilo según la posición del scroll
  if (scrollY > 100) {
    div.style.backgroundColor = 'black';               // Fondo negro cuando hacemos scroll
    div.style.borderBottom = '2px solid #00F5C8';     // Borde inferior con color accent
  } else {
    div.style.backgroundColor = 'transparent';         // Fondo transparente al inicio
    div.style.borderBottom = '0px';                   // Sin borde al inicio
  }
});

// Esta función ajusta la longitud del texto según el tamaño de la pantalla
// Es útil para hacer el contenido más legible en diferentes dispositivos
function adjustOverviewLength() {
  // Seleccionamos todos los elementos que contienen descripciones
  const overviewElements = document.querySelectorAll('.slide-info p');

  // Definimos los límites de caracteres según el tamaño de pantalla
  const maxLengthLarge = 1000;    // Máximo de caracteres en pantallas grandes
  const maxLengthSmall = 300;     // Máximo de caracteres en pantallas pequeñas

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
