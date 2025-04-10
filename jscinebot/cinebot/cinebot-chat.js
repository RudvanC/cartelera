import { addMessage, getMessageHistory, saveConversation, loadConversation, resetHistory, addWelcomeMessage } from './cinebot-chatHistory.js';

// Cargar la conversación al iniciar
let conversation = loadConversation();
if (!conversation) {
    resetHistory();
    addWelcomeMessage();
}

// Función para enviar mensaje
async function sendMessage() {
    const input = document.getElementById('cinebot-input');
    const message = input.value.trim();
    
    if (message) {
        // Añadir mensaje del usuario al historial
        addMessage('user', message);
        
        // Mostrar mensaje del usuario en el chat
        displayMessage(message, 'user');
        
        // Limpiar input
        input.value = '';
        
        // Mostrar indicador de escritura
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'cinebot-message cinebot-typing';
        typingIndicator.textContent = 'CineBot está escribiendo...';
        document.getElementById('cinebot-messages').appendChild(typingIndicator);
        
        try {
            // Obtener respuesta de la API
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: getMessageHistory(),
                    temperature: 0.7
                })
            });
            
            const data = await response.json();
            
            // Remover indicador de escritura
            typingIndicator.remove();
            
            if (data.choices && data.choices[0]) {
                const botMessage = data.choices[0].message.content;
                
                // Añadir respuesta al historial
                addMessage('assistant', botMessage);
                
                // Mostrar respuesta en el chat
                displayMessage(botMessage, 'assistant');
                
                // Guardar conversación
                saveConversation();
            }
        } catch (error) {
            console.error('Error:', error);
            typingIndicator.remove();
            displayMessage('Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.', 'assistant');
        }
    }
} 