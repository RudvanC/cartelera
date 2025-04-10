import { config, modelConfig } from './cinebot-config.js';
import { messageHistory, addMessage, saveConversation } from './cinebot-chatHistory.js';
import { processMovieQuery } from './cinebot-movieService.js';

// Función para enviar mensaje a la API de Mistral
export async function sendMessageToMistral(userInput) {
    try {
        // Verificar si el mensaje está relacionado con películas
        const movieInfo = await processMovieQuery(userInput);
        if (movieInfo) {
            addMessage('system', `Información de la película: ${JSON.stringify(movieInfo)}`);
        }

        // Enviar la solicitud a la API de Mistral
        const response = await axios.post(config.mistral.apiUrl, {
            model: modelConfig.model,
            messages: messageHistory,
            temperature: modelConfig.temperature,
            max_tokens: modelConfig.max_tokens
        }, {
            headers: {
                'Authorization': `Bearer ${config.mistral.apiKey}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        throw error;
    }
} 