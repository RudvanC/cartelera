// Configuración de APIs
export const config = {
    mistral: {
        apiKey: 'wp9MBfhaVYcDsdNq1NCzEgjleB9eRQqV',
        apiUrl: 'https://api.mistral.ai/v1/chat/completions'
    },
    tmdb: {
        apiKey: 'd47b7a69abf720959fe4fefb4d956b2f',
        baseUrl: 'https://api.themoviedb.org/3'
    }
};

// Configuración del modelo
export const modelConfig = {
    model: "mistral-tiny",
    temperature: 0.7,
    maxTokens: 150,
    topP: 0.9,
    stream: false,
    safeMode: false,
    randomSeed: 42
};

// Palabras clave para detectar consultas de películas
export const movieKeywords = [
    'película', 'pelicula', 'cine', 'movie', 'film', 
    'recomiéndame', 'recomendame', 'recomienda', 'recomendar'
]; 