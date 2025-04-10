import { config } from './cinebot-config.js';

// Función para buscar información de películas
export async function searchMovie(query) {
    try {
        const response = await axios.get(`${config.tmdb.baseUrl}/search/movie`, {
            params: {
                api_key: config.tmdb.apiKey,
                query: query,
                language: 'es-ES'
            }
        });
        return response.data.results[0];
    } catch (error) {
        console.error('Error al buscar película:', error);
        return null;
    }
}

// Función para obtener detalles de una película
export async function getMovieDetails(movieId) {
    try {
        const response = await axios.get(`${config.tmdb.baseUrl}/movie/${movieId}`, {
            params: {
                api_key: config.tmdb.apiKey,
                language: 'es-ES'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener detalles de la película:', error);
        return null;
    }
}

// Función para procesar una consulta de película
export async function processMovieQuery(query) {
    const movie = await searchMovie(query);
    if (movie) {
        const details = await getMovieDetails(movie.id);
        if (details) {
            return {
                title: details.title,
                year: details.release_date.split('-')[0],
                overview: details.overview,
                rating: details.vote_average
            };
        }
    }
    return null;
} 