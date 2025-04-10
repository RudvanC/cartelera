import { API_CONFIG } from '../config.js';

document.addEventListener('DOMContentLoaded', () => {
    initSearchBar();
});

async function searchMovies(query) {
    const options = {
        method: 'GET',
        headers: API_CONFIG.HEADERS
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

function displaySearchResults(movies, searchInput, mainContent) {
    let searchResults = document.getElementById('search-results');
    if (!searchResults) {
        searchResults = document.createElement('div');
        searchResults.id = 'search-results';
        searchResults.className = 'search-results';
        mainContent.insertBefore(searchResults, mainContent.firstChild);
    }

    // Si no hay texto en el input, ocultar resultados
    if (!searchInput.value.trim()) {
        searchResults.classList.remove('active');
        return;
    }

    // Activar visualización de resultados
    searchResults.classList.add('active');

    if (movies.length === 0) {
        searchResults.innerHTML = `
            <div class="search-header">
                <h2>Resultados de la búsqueda</h2>
                <button class="close-search">✕</button>
            </div>
            <p class="no-results">No se encontraron películas</p>`;
        return;
    }

    searchResults.innerHTML = `
        <div class="search-header">
            <h2>Resultados de la búsqueda</h2>
            <button class="close-search">✕</button>
        </div>
        <div class="movies-grid">
            ${movies.map(movie => `
                <div class="movie-card">
                    <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank"> 
                        <img src="${movie.poster_path ? API_CONFIG.IMAGE_BASE_URL + movie.poster_path : '../assets/no-poster.png'}" 
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

    // Agregar evento para cerrar resultados
    const closeButton = searchResults.querySelector('.close-search');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            searchResults.classList.remove('active');
            searchInput.value = '';
        });
    }
}

export function initSearchBar() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) {
        console.error('Search input not found');
        return;
    }
    const searchButton = document.querySelector('.search-button');
    const mainContent = document.querySelector('main');

    let timeoutId = null;

    // Event listeners
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim().length >= 3) {
            e.preventDefault();
            searchMovies(searchInput.value.trim()).then(movies => {
                displaySearchResults(movies, searchInput, mainContent);
            });
        }
    });

    searchButton.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        if (query.length >= 3) {
            const movies = await searchMovies(query);
            displaySearchResults(movies, searchInput, mainContent);
        }
    });

    // Removemos el listener de 'input' anterior y lo reemplazamos por uno más simple
    searchInput.addEventListener('input', (e) => {
        if (!e.target.value.trim()) {
            const searchResults = document.getElementById('search-results');
            if (searchResults) {
                searchResults.classList.remove('active');
            }
        }
    });
}