// Importa la configuración de la API y el límite de películas desde el archivo config.js
import { API_CONFIG } from '../config.js';
import { movieLimit } from '../config.js';

// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
  initGenreMovies();
});

// Función para obtener la lista de géneros de películas desde la API
async function fetchGenres() {
  // URL para obtener la lista de géneros en español

  const GENRES_URL = 'https://api.themoviedb.org/3/genre/movie/list?language=es-US'; // Llama a la API de TMDB para obtener los géneros de películas y devuelve un array.

  try {
    // Realiza la petición a la API con los headers necesarios
    const response = await fetch(GENRES_URL, { headers: API_CONFIG.HEADERS });
    // Verifica si la respuesta fue exitosa
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    // Convierte la respuesta a JSON
    const data = await response.json();
    // Retorna la lista de géneros
    return data.genres;
  } catch (error) {
    // Maneja cualquier error que ocurra durante la petición
    console.error('Error al obtener géneros:', error);
    return [];
  }
}

// Función para obtener películas por género específico
async function fetchMoviesByGenre(genreId) {
  // URL para descubrir películas por género en español
  const DISCOVER_URL = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=es-US&page=1`;
  try {
    // Realiza la petición a la API
    const response = await fetch(DISCOVER_URL, { headers: API_CONFIG.HEADERS });
    // Verifica si la respuesta fue exitosa
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    // Convierte la respuesta a JSON
    const data = await response.json();
    // Retorna la lista de películas
    return data.results;
  } catch (error) {
    // Maneja cualquier error que ocurra durante la petición
    console.error(`Error al obtener películas para el género ${genreId}:`, error);
    return [];
  }
}

// Función para renderizar las películas en el contenedor especificado
function renderMovies(movies, container, limit = movies.length) {
  // Verifica si el contenedor existe
  if (!container) {
    console.error("❌ Contenedor no encontrado");
    return;
  }

  // Limpia el contenedor antes de agregar nuevas películas
  container.innerHTML = '';
  // Itera sobre las películas hasta el límite especificado
  movies.slice(0, limit).forEach(movie => {
    // Crea un elemento div para cada película
    const movieElement = document.createElement('div');
    movieElement.classList.add('genre-movie');
    // Agrega el HTML con la información de la película
    movieElement.innerHTML = `
      <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank" rel="noopener noreferrer">
        <img src="${API_CONFIG.IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>⭐ ${movie.vote_average.toFixed(1)}</p>
      </a>
    `;
    // Agrega el elemento de película al contenedor
    container.appendChild(movieElement);
  });
}

// Función principal para renderizar las secciones de géneros
export async function renderGenresSections() {
  // Obtiene la lista de géneros
  const genres = await fetchGenres();
  // Limita la cantidad de géneros a mostrar
  const limitedGenres = genres.slice(0, movieLimit);
  // Obtiene el contenedor principal de géneros
  const genresContainer = document.getElementById('genres');

  // Verifica si el contenedor existe
  if (!genresContainer) {
    console.error("❌ No se encontró el contenedor con id 'genres'");
    return;
  }

  // Limpia el contenedor antes de agregar nuevas secciones
  genresContainer.innerHTML = '';

  // Itera sobre cada género
  for (const genre of limitedGenres) {
    // Crea una sección para cada género
    const section = document.createElement('section');
    section.classList.add('genre-section');
    // Agrega el HTML con el título del género y un contenedor para las películas
    section.innerHTML = `<h2>${genre.name}</h2>
      <div class="genre-movies" id="genre-${genre.id}"></div>`;
    // Agrega la sección al contenedor principal
    genresContainer.appendChild(section);

    // Obtiene las películas para el género actual
    const movies = await fetchMoviesByGenre(genre.id);
    // Renderiza las películas en el contenedor correspondiente
    renderMovies(movies, document.getElementById(`genre-${genre.id}`), 7);
  }
}

// Función de inicialización que comienza el proceso de renderizado
export function initGenreMovies() {
  renderGenresSections();
}
