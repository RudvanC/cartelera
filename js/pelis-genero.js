document.addEventListener("DOMContentLoaded", () => {
    // Configuración del token de autenticación y headers
    const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNDdiN2E2OWFiZjcyMDk1OWZlNGZlZmI0ZDk1NmIyZiIsIm5iZiI6MTc0MzUwODg3NC41Miwic3ViIjoiNjdlYmQ1OGFkOTk4MWZkYTE4N2FiMThiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.AFTSgit9VCyrI73TyetYSx-R25OF19oC1ICganpp4Lw';
    const HEADERS = {
        'accept': 'application/json',
        'Authorization': `Bearer ${BEARER_TOKEN}`
    };

    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

    const menuButton = document.getElementById('genre-menu-button');
    const genreMenu = document.getElementById('genre-menu');
    const genresContainer = document.getElementById('genres');

    // Función para obtener los géneros
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
        container.innerHTML = ''; // Limpiar el contenedor de películas
        movies.slice(0, limit).forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('genre-movie');
            movieElement.innerHTML = `
                <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>⭐ ${movie.vote_average.toFixed(1)}</p>
                <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank" rel="noopener noreferrer">Ver más</a>
            `;
            container.appendChild(movieElement);
        });
    }

    // Función para renderizar el menú de géneros
    async function renderGenreMenu() {
        const genres = await fetchGenres();
        genreMenu.innerHTML = ''; // Limpiar el menú antes de llenarlo

        genres.slice(0, 3).forEach(genre => {
            const menuItem = document.createElement('li');
            menuItem.textContent = genre.name;
            menuItem.dataset.genreId = genre.id;
            genreMenu.appendChild(menuItem);
        });

        genreMenu.addEventListener('click', async (event) => {
            if (event.target.tagName === 'LI') {
                const selectedGenreId = event.target.dataset.genreId;
                const movies = await fetchMoviesByGenre(selectedGenreId);
                renderMovies(movies, genresContainer, 5);
                genreMenu.classList.remove('show'); // Ocultar el menú después de seleccionar un género
            }
        });
    }

    // Mostrar u ocultar el menú al hacer clic en el botón
    menuButton.addEventListener('click', () => {
        genreMenu.classList.toggle('show'); // Cambiar la clase para mostrar/ocultar
    });

    // Cerrar el menú si se hace clic fuera del botón o del menú
    document.addEventListener('click', (event) => {
        if (!menuButton.contains(event.target) && !genreMenu.contains(event.target)) {
            genreMenu.classList.remove('show');
        }
    });

    // Cargar el menú y las películas
    renderGenreMenu();
});
