// genres.js
document.addEventListener("DOMContentLoaded", () => {
    // Configuración del token de autenticación y headers
    const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNDdiN2E2OWFiZjcyMDk1OWZlNGZlZmI0ZDk1NmIyZiIsIm5iZiI6MTc0MzUwODg3NC41Miwic3ViIjoiNjdlYmQ1OGFkOTk4MWZkYTE4N2FiMThiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.AFTSgit9VCyrI73TyetYSx-R25OF19oC1ICganpp4Lw';
    const HEADERS = {
      'accept': 'application/json'
    };
  
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
  
    // Función para obtener la lista de géneros
    async function fetchGenres() {
      const GENRES_URL = 'https://api.themoviedb.org/3/genre/movie/list?language=es-US';
      try {
        const response = await fetch(GENRES_URL, { headers: HEADERS });
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        return data.genres; // Array de géneros: { id, name }
      } catch (error) {
        console.error('Error al obtener géneros:', error);
        return [];
      }
    }
  
    // Función para obtener películas de un género específico
    async function fetchMoviesByGenre(genreId) {
      const DISCOVER_URL = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=es-US&page=1`;
      try {
        const response = await fetch(DISCOVER_URL, { headers: HEADERS });
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        return data.results;
      } catch (error) {
        console.error(`Error al obtener películas para el género ${genreId}:`, error);
        return [];
      }
    }
  
    // Función para renderizar películas en un contenedor dado
    function renderMovies(movies, container, limit = movies.length) {
      container.innerHTML = '';
      movies.slice(0, limit).forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('genre-movie');
        movieElement.innerHTML = `
          <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
          <h3>${movie.title}</h3>
          <p>⭐ ${movie.vote_average.toFixed(1)}</p>
           <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank" rel="noopener noreferrer" onclick="console.log('Clic en Ver Más: https://www.themoviedb.org/movie/${movie.id}')">Ver más</a>
        `;
        container.appendChild(movieElement);
      });
    }
  
    async function renderGenresSections() {
        const genres = await fetchGenres();
        // Limitar a 3 géneros
        const limitedGenres = genres.slice(6, 11);
        const genresContainer = document.getElementById('genres');
        if (!genresContainer) {
          console.error("No se encontró el contenedor con id 'genres'");
          return;
        }
        genresContainer.innerHTML = '';

        for (const genre of limitedGenres) {
          // Crear la sección para el género
          const section = document.createElement('section');
          section.classList.add('genre-section');
          section.innerHTML = `<h2>${genre.name}</h2>
            <div class="genre-movies" id="genre-${genre.id}"></div>`;
          genresContainer.appendChild(section);

          // Obtener y renderizar películas para este género (por ejemplo, 5 películas)
          const movies = await fetchMoviesByGenre(genre.id);
          renderMovies(movies, document.getElementById(`genre-${genre.id}`), 5);
        }
      }

      // Iniciar la renderización de secciones por género
      renderGenresSections();
    });
  