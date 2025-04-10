// Funciones de la interfaz de usuario
export function displayMessage(message, className) {
    const chatContainer = document.getElementById('cinebot-chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = `cinebot-message ${className}`;
    
    // Convertir markdown a HTML
    let formattedMessage = message
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Negrita
        .replace(/\n/g, '<br>'); // Saltos de línea
    
    messageDiv.innerHTML = formattedMessage;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

export function showTypingIndicator() {
    const chatContainer = document.getElementById('cinebot-chat-container');
    const indicator = document.createElement('div');
    indicator.className = 'cinebot-typing-indicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    chatContainer.appendChild(indicator);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

export function hideTypingIndicator() {
    const chatContainer = document.getElementById('cinebot-chat-container');
    const indicator = chatContainer.querySelector('.cinebot-typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

export function clearChatContainer() {
    const chatContainer = document.getElementById('cinebot-chat-container');
    chatContainer.innerHTML = '';
}

export function handleError(error) {
    console.error('Error:', error);
    
    // Mensaje de error más amigable para el usuario
    let errorMessage = 'Lo siento, ha ocurrido un error. ';
    
    if (error.message.includes('API key no configurada')) {
        errorMessage = 'Error: API key no configurada. Por favor, configura tu API key de Mistral en el archivo cinebot-api.js';
    } else if (error.message.includes('Error de autenticación')) {
        errorMessage = 'Error: API key inválida o no configurada. Por favor, verifica tu API key de Mistral';
    } else if (error.message.includes('Límite de solicitudes')) {
        errorMessage = 'Hemos alcanzado el límite de solicitudes. Por favor, inténtalo de nuevo más tarde.';
    } else if (error.message.includes('No se pudo conectar')) {
        errorMessage = 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.';
    } else {
        errorMessage += 'Por favor, intenta de nuevo más tarde.';
    }
    
    return errorMessage;
} 