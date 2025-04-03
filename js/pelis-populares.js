document.addEventListener("DOMContentLoaded", () => {
  const API_URL = 'https://api.themoviedb.org/3/movie/popular?include_adult=false&language=es-US&page=1';
  const options = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNDdiN2E2OWFiZjcyMDk1OWZlNGZlZmI0ZDk1NmIyZiIsIm5iZiI6MTc0MzUwODg3NC41Miwic3ViIjoiNjdlYmQ1OGFkOTk4MWZkYTE4N2FiMThiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.AFTSgit9VCyrI73TyetYSx-R25OF19oC1ICganpp4Lw', // Reemplaza con tu API Key
      'accept': 'application/json'
    }
  };



  async function fetchPopularMovies() {
    try {
      const response = await fetch(API_URL, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      showMovies(data.results);
    } catch (error) {
      console.error('Error al obtener las películas populares:', error);
    }
  }

  function initPopularMovies() {
    function showMovies(movies) {
        const container = document.getElementById('popular-movies');
        if (!container) {
            console.error('Popular movies container not found');
            return;
        }
        container.innerHTML = ''; // Limpia el contenedor
        const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
        // Limita el array a las 3 primeras películas
        const moviesToShow = movies.slice(0, 3);
      
        moviesToShow.forEach(movie => {
          const movieElement = document.createElement('div');
          movieElement.classList.add('popular-movie');
          movieElement.innerHTML = `
            <img class="popular-image" src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <h4>⭐ ${movie.vote_average.toFixed(1)}</h4>
            <p>${movie.overview.substring(0, 200)}...</p>
            <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank" rel="noopener noreferrer" onclick="console.log('Clic en Ver Más: https://www.themoviedb.org/movie/${movie.id}')">Ver más</a>
          `;
          container.appendChild(movieElement);
        });
    }

    fetchPopularMovies();
  }

  initPopularMovies();
});
