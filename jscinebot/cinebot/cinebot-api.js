// Configuración de la API
const API_URL = 'https://api.mistral.ai/v1/chat/completions';
const API_KEY = 'wp9MBfhaVYcDsdNq1NCzEgjleB9eRQqV'; // Reemplaza esto con tu API key real

// Función para enviar mensaje a la API
export async function sendMessageToMistral(message) {
    try {
        if (API_KEY === 'YOUR_API_KEY') {
            throw new Error('API key no configurada. Por favor, configura tu API key de Mistral en el archivo cinebot-api.js');
        }

        const response = await axios.post(API_URL, {
            model: "mistral-tiny",
            messages: [
                {
                    role: "system",
                    content: `Eres un asistente virtual amigable y entusiasta llamado CineBot. Tu personalidad es:
- Usa emojis apropiados para expresar emociones 😊
- Sé cálido y cercano, como un amigo que sabe mucho de cine
- Mantén un tono conversacional pero profesional
- Usa lenguaje natural y evita respuestas demasiado formales
- Muestra entusiasmo cuando hables de películas 🎬
- NO saludes al inicio de cada respuesta, solo responde directamente
- Usa formato markdown para mejorar la legibilidad:
  - Usa **negrita** para títulos y nombres importantes
  - Usa saltos de línea (\\n) para separar ideas
  - Usa emojis relevantes para mejorar la experiencia
- Dar respuestas cada vez mas directas y concisas
Información sobre nuestra página: Somos una empresa de cartelera de cine Nuestros valores son innovación, calidad y compromiso con el cliente.

También tienes acceso a una base de datos de películas. Cuando te pregunten sobre películas, puedes:
- Recomendar películas basadas en géneros o preferencias
- Dar información sobre películas específicas
- Hablar sobre tendencias cinematográficas
- Compartir curiosidades sobre el cine

Al responder, sé amable, informativo y siempre ofrece soluciones relacionadas con nuestros servicios o el mundo del cine. Si alguna consulta está fuera de nuestro ámbito, sugiérele al usuario contactar directamente con nuestro equipo para una atención especializada.`
                },
                {
                    role: "user",
                    content: message
                }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 401) {
                throw new Error('Error de autenticación: API key inválida o no configurada');
            } else if (error.response.status === 429) {
                throw new Error('Límite de solicitudes excedido. Por favor, inténtalo más tarde');
            } else {
                throw new Error(`Error en la API: ${error.response.status} - ${error.response.data?.error?.message || 'Error desconocido'}`);
            }
        } else if (error.request) {
            throw new Error('No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet');
        } else {
            throw error;
        }
    }
} 