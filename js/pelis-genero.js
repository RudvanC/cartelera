import { API_CONFIG } from '../config.js';
import { movieLimit } from '../config.js';
document.addEventListener("DOMContentLoaded", () => {
  initGenreMovies();
});

async function fetchGenres() {
  const GENRES_URL = 'https://api.themoviedb.org/3/genre/movie/list?language=es-US'; // Llama a la API de TMDB para obtener los géneros de películas y devuelve un array.
  try {
    const response = await fetch(GENRES_URL, { headers: API_CONFIG.HEADERS });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error('Error al obtener géneros:', error);
    return [];
  }
}

// 
async function fetchMoviesByGenre(genreId) {
  const DISCOVER_URL = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=es-US&page=1`;
  try {
    const response = await fetch(DISCOVER_URL, { headers: API_CONFIG.HEADERS });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(`Error al obtener películas para el género ${genreId}:`, error);
    return [];
  }
}

function renderMovies(movies, container, limit = movies.length) {
  if (!container) {
    console.error("❌ Contenedor no encontrado");
    return;
  }

  container.innerHTML = '';
  movies.slice(0, limit).forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('genre-movie');
    movieElement.innerHTML = `
      <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank" rel="noopener noreferrer">
        <img src="${API_CONFIG.IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>⭐ ${movie.vote_average.toFixed(1)}</p>
      </a>
    `;
    container.appendChild(movieElement);
  });
}

export async function renderGenresSections() {
  const genres = await fetchGenres();
  const limitedGenres = genres.slice(0, movieLimit);
  const genresContainer = document.getElementById('genres');

  if (!genresContainer) {
    console.error("❌ No se encontró el contenedor con id 'genres'");
    return;
  }

  genresContainer.innerHTML = '';

  for (const genre of limitedGenres) {
    const section = document.createElement('section');
    section.classList.add('genre-section');
    section.innerHTML = `<h2>${genre.name}</h2>
      <div class="genre-movies" id="genre-${genre.id}"></div>`;
    genresContainer.appendChild(section);

    const movies = await fetchMoviesByGenre(genre.id);
    renderMovies(movies, document.getElementById(`genre-${genre.id}`), 7);
  }
}

export function initGenreMovies() {
  renderGenresSections();
}
