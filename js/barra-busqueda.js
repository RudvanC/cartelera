document.addEventListener('DOMContentLoaded', () => {
    initSearchBar();
});

function initSearchBar() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) {
        console.error('Search input not found');
        return;
    }
    const searchButton = document.querySelector('.search-button');
    const mainContent = document.querySelector('main');

    const API_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNDdiN2E2OWFiZjcyMDk1OWZlNGZlZmI0ZDk1NmIyZiIsIm5iZiI6MTc0MzUwODg3NC41Miwic3ViIjoiNjdlYmQ1OGFkOTk4MWZkYTE4N2FiMThiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.AFTSgit9VCyrI73TyetYSx-R25OF19oC1ICganpp4Lw';
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

    let timeoutId = null;

    async function searchMovies(query) {
        const options = {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': API_KEY
            }
        };

        try {
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=es-US&page=1`, options);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error al buscar películas:', error);
            return [];
        }
    }

    function displaySearchResults(movies) {
        // Crear contenedor de resultados si no existe
        let searchResults = document.getElementById('search-results');
        if (!searchResults) {
            searchResults = document.createElement('div');
            searchResults.id = 'search-results';
            searchResults.className = 'search-results';
            mainContent.insertBefore(searchResults, mainContent.firstChild);
        }

        // Mostrar resultados
        if (movies.length === 0) {
            searchResults.innerHTML = '<p class="no-results">No se encontraron películas</p>';
            return;
        }

        searchResults.innerHTML = `
            <h2>Resultados de la búsqueda</h2>
            <div class="movies-grid">
                ${movies.map(movie => `
                    <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank"> 
                    <div class="movie-card">
                        <img src="${movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : '../assets/no-poster.png'}" 
                             alt="${movie.title}">
                        <div class="movie-info">
                            <h3>${movie.title}</h3>
                            <p>⭐ ${movie.vote_average.toFixed(1)}</p>
                            <p>${movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</p>
                        </div>
                        </a>
                    </div>
                `).join('')}
            </div>`;
    }

    // Event listeners
    searchInput.addEventListener('input', (e) => {
        clearTimeout(timeoutId);
        if (e.target.value.length >= 3) {
            timeoutId = setTimeout(async () => {
                const movies = await searchMovies(e.target.value);
                displaySearchResults(movies);
            }, 500);
        }
    });

    searchButton.addEventListener('click', async () => {
        if (searchInput.value.length >= 3) {
            const movies = await searchMovies(searchInput.value);
            displaySearchResults(movies);
        }
    });
}