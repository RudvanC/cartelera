const TMDB_API_KEY = 'd47b7a69abf720959fe4fefb4d956b2f'; // Reemplaza con tu API key de TMDb
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

class MovieChatbot {
  constructor() {
    this.conversationHistory = [];
  }

  // Procesar mensaje del usuario
  async processMessage(userMessage) {
    // Guardar mensaje del usuario en el historial
    this.conversationHistory.push({ role: 'user', content: userMessage });
    
    // Analizar la intención del mensaje
    const intent = this.analyzeIntent(userMessage);
    
    let response;
    switch (intent.type) {
      case 'search':
        response = await this.searchMovies(intent.query);
        break;
      case 'popular':
        response = await this.getPopularMovies();
        break;
      case 'details':
        response = await this.getMovieDetails(intent.movieId || intent.query);
        break;
      case 'general_recommendation':
        response = await this.getGeneralRecommendations();
        break;
      case 'specific_recommendation':
        response = await this.getRecommendations(intent.query);
        break;
      case 'greeting':
        response = this.getGreeting();
        break;
      case 'help':
        response = this.getHelp();
        break;
      default:
        response = "Lo siento, no entendí tu consulta. Puedes preguntarme sobre películas, actores o directores.";
    }
    
    // Guardar respuesta del bot en el historial
    this.conversationHistory.push({ role: 'bot', content: response });
    
    return response;
  }

  // Analizar la intención del mensaje del usuario
  analyzeIntent(message) {
    const lowercaseMsg = message.toLowerCase();
    
    if (lowercaseMsg.includes('hola') || lowercaseMsg.includes('saludos')) {
      return { type: 'greeting' };
    }
    
    if (lowercaseMsg.includes('ayuda') || lowercaseMsg.includes('qué puedes hacer')) {
      return { type: 'help' };
    }
    
    if (lowercaseMsg.includes('popular') || lowercaseMsg.includes('mejor valoradas')) {
      return { type: 'popular' };
    }
    
    // Comprobar si es una petición general de recomendaciones
    if ((lowercaseMsg.includes('recomienda') || lowercaseMsg.includes('recomendaciones')) && 
        (lowercaseMsg.includes('qué') || lowercaseMsg.includes('que') || lowercaseMsg.includes('cuáles') || 
         lowercaseMsg.includes('cuales') || lowercaseMsg.includes('me puedes') || 
         lowercaseMsg.includes('película') || lowercaseMsg.match(/^recomiendame/))) {
      return { type: 'general_recommendation' };
    }
    
    // Comprobar si es una recomendación específica
    if ((lowercaseMsg.includes('recomienda') || lowercaseMsg.includes('similar')) && 
        (lowercaseMsg.includes('como') || lowercaseMsg.includes('parecido') || 
         lowercaseMsg.includes('parecida') || lowercaseMsg.includes('basado en'))) {
      return { 
        type: 'specific_recommendation',
        query: this.extractMovieName(lowercaseMsg)
      };
    }
    
    if (lowercaseMsg.includes('detalles') || lowercaseMsg.includes('información sobre')) {
      return { 
        type: 'details',
        query: this.extractMovieName(lowercaseMsg)
      };
    }
    
    // Por defecto, asumimos que quiere buscar una película
    return { 
      type: 'search',
      query: message
    };
  }
  
  // Extraer nombre de película de la consulta
  extractMovieName(message) {
    // Esta es una implementación básica, se podría mejorar con NLP
    const patterns = [
      /información sobre "(.*?)"/i,
      /detalles de "(.*?)"/i,
      /película "(.*?)"/i,
      /sobre "(.*?)"/i,
      /similar a "(.*?)"/i,
      /recomienda como "(.*?)"/i,
      /parecido a "(.*?)"/i,
      /parecida a "(.*?)"/i,
      /basado en "(.*?)"/i
    ];
    
    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    // Si no hay coincidencias con patrones, eliminar palabras comunes
    const commonWords = [
      'información', 'detalles', 'película', 'sobre', 'similar', 'a', 'como', 
      'recomienda', 'me', 'puedes', 'dar', 'una', 'un', 'el', 'la', 'los', 'las',
      'parecido', 'parecida', 'basado', 'en', 'recomiendame', 'recomendaciones'
    ];
    
    let query = message;
    commonWords.forEach(word => {
      query = query.replace(new RegExp(`\\b${word}\\b`, 'gi'), '');
    });
    
    return query.trim();
  }

  // Respuestas para diferentes intenciones
  getGreeting() {
    const greetings = [
      "¡Hola! Soy el asistente de películas. ¿En qué puedo ayudarte?",
      "¡Bienvenido! Puedo ayudarte a encontrar información sobre películas. ¿Qué te gustaría saber?",
      "¡Saludos! Pregúntame sobre cualquier película y te ayudaré."
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  getHelp() {
    return `
    Puedo ayudarte con:
    - Buscar películas por título
    - Mostrar películas populares
    - Dar detalles sobre una película específica
    - Recomendar películas similares a una que te guste
    - Sugerir películas para ver
    
    Ejemplos de preguntas:
    - "Busca La La Land"
    - "Películas populares"
    - "Información sobre Interestelar"
    - "Recomienda películas similares a Matrix"
    - "Qué películas me recomiendas"
    `;
  }

  // Nuevo método para recomendaciones generales
  async getGeneralRecommendations() {
    try {
      // Obtener películas populares o mejores valoradas
      const url = `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=es-ES&page=1`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const movies = data.results.slice(0, 5); // Limitamos a 5 resultados
        let result = "Aquí tienes algunas recomendaciones de películas muy bien valoradas:\n\n";
        
        movies.forEach((movie, index) => {
          result += `${index + 1}. ${movie.title} (${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'})\n`;
          result += `   Valoración: ${movie.vote_average}/10\n`;
          if (movie.overview) {
            result += `   Sinopsis: ${movie.overview.substring(0, 100)}...\n`;
          }
          result += '\n';
        });
        
        result += "¿Te gustaría más información sobre alguna de estas películas?";
        return result;
      } else {
        return "Lo siento, no pude obtener recomendaciones en este momento.";
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return "Lo siento, ha ocurrido un error al buscar recomendaciones. Por favor, inténtalo de nuevo más tarde.";
    }
  }

  // Métodos para interactuar con la API de TMDb
  async searchMovies(query) {
    try {
      const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=es-ES`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const movies = data.results.slice(0, 5); // Limitamos a 5 resultados
        let result = `He encontrado estas películas relacionadas con "${query}":\n\n`;
        
        movies.forEach((movie, index) => {
          result += `${index + 1}. ${movie.title} (${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'})\n`;
          result += `   Valoración: ${movie.vote_average}/10\n`;
          if (movie.overview) {
            result += `   Sinopsis: ${movie.overview.substring(0, 100)}...\n`;
          }
          result += '\n';
        });
        
        result += "¿Quieres más detalles sobre alguna de estas películas?";
        return result;
      } else {
        return `No he encontrado películas que coincidan con "${query}". ¿Quieres intentar con otra búsqueda?`;
      }
    } catch (error) {
      console.error('Error searching movies:', error);
      return "Lo siento, ha ocurrido un error al buscar películas. Por favor, inténtalo de nuevo más tarde.";
    }
  }
  
  async getPopularMovies() {
    try {
      const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=es-ES&page=1`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const movies = data.results.slice(0, 5); // Limitamos a 5 resultados
        let result = "Estas son las películas más populares actualmente:\n\n";
        
        movies.forEach((movie, index) => {
          result += `${index + 1}. ${movie.title} (${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'})\n`;
          result += `   Valoración: ${movie.vote_average}/10\n`;
          result += '\n';
        });
        
        return result;
      } else {
        return "Lo siento, no pude obtener las películas populares en este momento.";
      }
    } catch (error) {
      console.error('Error getting popular movies:', error);
      return "Lo siento, ha ocurrido un error al buscar películas populares. Por favor, inténtalo de nuevo más tarde.";
    }
  }
  
  async getMovieDetails(query) {
    try {
      // Primero buscamos la película para obtener su ID
      let movieId = query;
      if (isNaN(query)) {
        const searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=es-ES`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();
        
        if (searchData.results && searchData.results.length > 0) {
          movieId = searchData.results[0].id;
        } else {
          return `No encontré ninguna película llamada "${query}".`;
        }
      }
      
      // Obtenemos los detalles con el ID
      const detailsUrl = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=es-ES&append_to_response=credits`;
      const detailsResponse = await fetch(detailsUrl);
      const movie = await detailsResponse.json();
      
      if (movie.id) {
        let result = `📽️ **${movie.title}** (${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'})\n\n`;
        
        if (movie.tagline) {
          result += `"${movie.tagline}"\n\n`;
        }
        
        result += `⭐ **Valoración**: ${movie.vote_average}/10 (${movie.vote_count} votos)\n`;
        result += `⏱️ **Duración**: ${movie.runtime} minutos\n`;
        
        if (movie.genres && movie.genres.length > 0) {
          result += `🏷️ **Géneros**: ${movie.genres.map(g => g.name).join(', ')}\n`;
        }
        
        if (movie.overview) {
          result += `\n📝 **Sinopsis**:\n${movie.overview}\n\n`;
        }
        
        if (movie.credits && movie.credits.crew) {
          const directors = movie.credits.crew.filter(person => person.job === 'Director');
          if (directors.length > 0) {
            result += `🎬 **Director(es)**: ${directors.map(d => d.name).join(', ')}\n`;
          }
        }
        
        if (movie.credits && movie.credits.cast && movie.credits.cast.length > 0) {
          const mainCast = movie.credits.cast.slice(0, 5);
          result += `🎭 **Reparto principal**: ${mainCast.map(actor => actor.name).join(', ')}\n`;
        }
        
        return result;
      } else {
        return "Lo siento, no pude encontrar detalles para esta película.";
      }
    } catch (error) {
      console.error('Error getting movie details:', error);
      return "Lo siento, ha ocurrido un error al obtener los detalles de la película. Por favor, inténtalo de nuevo más tarde.";
    }
  }
  
  async getRecommendations(query) {
    try {
      // Primero buscamos la película para obtener su ID
      const searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=es-ES`;
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();
      
      if (searchData.results && searchData.results.length > 0) {
        const movieId = searchData.results[0].id;
        const recoUrl = `${TMDB_BASE_URL}/movie/${movieId}/recommendations?api_key=${TMDB_API_KEY}&language=es-ES`;
        const recoResponse = await fetch(recoUrl);
        const recoData = await recoResponse.json();
        
        if (recoData.results && recoData.results.length > 0) {
          const movies = recoData.results.slice(0, 5);
          let result = `Películas similares a "${searchData.results[0].title}":\n\n`;
          
          movies.forEach((movie, index) => {
            result += `${index + 1}. ${movie.title} (${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'})\n`;
            result += `   Valoración: ${movie.vote_average}/10\n`;
            if (movie.overview) {
              result += `   Sinopsis: ${movie.overview.substring(0, 100)}...\n`;
            }
            result += '\n';
          });
          
          return result;
        } else {
          return `No encontré recomendaciones para "${query}".`;
        }
      } else {
        return `No encontré ninguna película llamada "${query}" para dar recomendaciones.`;
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return "Lo siento, ha ocurrido un error al buscar recomendaciones. Por favor, inténtalo de nuevo más tarde.";
    }
  }
}

// Exportamos la clase
export default MovieChatbot;


