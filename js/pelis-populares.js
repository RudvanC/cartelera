// Importa la configuración de la API desde el archivo config.js
import { API_CONFIG } from '../config.js';

// URL base para obtener las películas populares en español
const API_URL = 'https://api.themoviedb.org/3/movie/popular?include_adult=false&language=es-US&page=1';

// Función para obtener las películas populares desde la API
export async function fetchPopularMovies() {
  try {
    // Realiza la petición a la API con los headers necesarios
    const response = await fetch(API_URL, { headers: API_CONFIG.HEADERS });
    // Verifica si la respuesta fue exitosa
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Convierte la respuesta a JSON
    const data = await response.json();
    // Muestra las películas en el slider
    showMovies(data.results);
  } catch (error) {
    // Maneja cualquier error que ocurra durante la petición
    console.error('Error al obtener las películas populares:', error);
  }
}

// Función para mostrar las películas en el slider
function showMovies(movies) {
  // Obtiene el contenedor del slider
  const container = document.getElementById('slider');
  // Verifica si el contenedor existe
  if (!container) {
    console.error("❌ No se encontró el contenedor con id 'slider'");
    return;
  }

  // Limpia el contenedor antes de agregar nuevas películas
  container.innerHTML = '';

  // Define el límite de películas a mostrar
  const MOVIES_LIMIT = 5;
  // Obtiene solo las películas que se mostrarán
  const moviesToShow = movies.slice(0, MOVIES_LIMIT);

  // Itera sobre cada película para crear su elemento
  moviesToShow.forEach((movie) => {
    // Crea un elemento div para cada película
    const movieElement = document.createElement('div');
    movieElement.classList.add('slide');
    // Agrega el HTML con la información de la película
    movieElement.innerHTML = `
    <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank"> 
      <img class="slide-image" src="${API_CONFIG.IMAGE_BASE_URL_LARGE}${movie.backdrop_path}" alt="${movie.title}">
        <div class="slide-info">
          <h3>${movie.title}</h3>
          <h4>⭐ ${movie.vote_average.toFixed(1)}</h4>
          <p>${movie.overview.substring(0, 1000)}...</p>
          <p>Fecha de lanzamiento "${movie.release_date}"</p>
        </div>
    </a>
    `;
    // Agrega el elemento de película al contenedor
    container.appendChild(movieElement);
  });

  // Inicializa el slider con las nuevas películas
  initSlider();
}

// Función para inicializar el slider
function initSlider() {
  // Obtiene el contenedor del slider
  const sliderContainer = document.getElementById("slider");
  // Verifica si el contenedor existe
  if (!sliderContainer) {
    console.error("❌ No se encontró el contenedor con id 'slider'");
    return;
  }

  // Obtiene todos los elementos slide
  const slides = document.querySelectorAll(".slide");
  // Obtiene el total de slides
  const totalSlides = slides.length;
  // Inicializa el índice actual en 0
  let currentIndex = 0;

  // Función para mostrar un slide específico
  function showSlide(index) {
    // Mueve el slider a la posición del slide especificado
    sliderContainer.style.transform = `translateX(-${index * 100}%)`;
  }

  // Función para mostrar el siguiente slide
  function nextSlide() {
    // Calcula el índice del siguiente slide
    currentIndex = (currentIndex + 1) % totalSlides;
    // Muestra el siguiente slide
    showSlide(currentIndex);
  }

  // Función para mostrar el slide anterior
  function prevSlide() {
    // Calcula el índice del slide anterior
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    // Muestra el slide anterior
    showSlide(currentIndex);
  }

  // Agrega los event listeners para los botones de navegación
  document.getElementById("prev").addEventListener("click", prevSlide);
  document.getElementById("next").addEventListener("click", nextSlide);

  // Configura el cambio automático de slides cada 3 segundos
  setInterval(nextSlide, 3000);
  // Muestra el primer slide
  showSlide(currentIndex);
}

// Función de inicialización que comienza el proceso de carga de películas populares
export function initPopularMovies() {
  fetchPopularMovies();
}
 
 
 
 