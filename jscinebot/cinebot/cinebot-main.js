import { addMessage, getMessageHistory, loadConversation, saveConversation, resetHistory } from './cinebot-chatHistory.js';
import { displayMessage, showTypingIndicator, hideTypingIndicator, clearChatContainer, handleError } from './cinebot-ui.js';
import { sendMessageToMistral } from './cinebot-api.js';

// Variables para el widget
let isChatVisible = false;
const chatContainer = document.getElementById('cinebot-chat');
const toggleButton = document.getElementById('cinebot-toggle-button');
const minimizeButton = document.getElementById('cinebot-minimize');

// Función para mostrar/ocultar el chat
function toggleChat() {
    isChatVisible = !isChatVisible;
    chatContainer.classList.toggle('active', isChatVisible);
    toggleButton.textContent = isChatVisible ? '✕' : '🎬';
}

// Función para minimizar el chat
function minimizeChat() {
    isChatVisible = false;
    chatContainer.classList.remove('active');
    toggleButton.textContent = '🎬';
}

// Función principal para enviar mensaje
async function sendCinebotMessage() {
    const userInput = document.getElementById('cinebot-user-input');
    const message = userInput.value.trim();
    
    if (!message) return;
    
    // Mostrar mensaje del usuario
    displayMessage(message, 'cinebot-user-message');
    addMessage('user', message);
    
    // Limpiar input
    userInput.value = '';
    
    // Mostrar indicador de escritura
    showTypingIndicator();
    
    try {
        // Enviar mensaje a la API
        const response = await sendMessageToMistral(message);
        
        // Ocultar indicador de escritura
        hideTypingIndicator();
        
        // Mostrar respuesta del bot
        displayMessage(response, 'cinebot-bot-message');
        addMessage('assistant', response);
        
        // Guardar conversación
        saveConversation();
    } catch (error) {
        hideTypingIndicator();
        const errorMessage = handleError(error);
        displayMessage(errorMessage, 'cinebot-bot-message');
    }
}

// Función para limpiar el chat
function clearCinebotChat() {
    clearChatContainer();
    resetHistory();
    // Añadir el mensaje de bienvenida al historial
    addMessage('assistant', '¡Hola! 👋 Soy CineBot, tu asistente virtual. ¿En qué puedo ayudarte hoy? Puedo hablar sobre cine o recomendarte algunas películas interesantes 🎬');
    // Mostrar el mensaje de bienvenida
    displayMessage('¡Hola! 👋 Soy CineBot, tu asistente virtual. ¿En qué puedo ayudarte hoy? Puedo hablar sobre cine o recomendarte algunas películas interesantes 🎬', 'cinebot-bot-message');
    saveConversation();
}

// Cargar la conversación al iniciar
document.addEventListener('DOMContentLoaded', () => {
    // Configurar eventos del widget
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleChat);
    }
    
    if (minimizeButton) {
        minimizeButton.addEventListener('click', minimizeChat);
    }

    const savedHistory = loadConversation();
    if (savedHistory) {
        // Mostrar todos los mensajes excepto el del sistema
        savedHistory.forEach(msg => {
            if (msg.role !== 'system') {
                displayMessage(msg.content, msg.role === 'user' ? 'cinebot-user-message' : 'cinebot-bot-message');
            }
        });
    } else {
        // Añadir el mensaje de bienvenida al historial
        addMessage('assistant', '¡Hola! 👋 Soy CineBot, tu asistente virtual. ¿En qué puedo ayudarte hoy? Puedo hablar sobre cine o recomendarte algunas películas interesantes 🎬');
        // Mostrar el mensaje de bienvenida
        displayMessage('¡Hola! 👋 Soy CineBot, tu asistente virtual. ¿En qué puedo ayudarte hoy? Puedo hablar sobre cine o recomendarte algunas películas interesantes 🎬', 'cinebot-bot-message');
        saveConversation();
    }

    // Añadir el evento de tecla Enter al input
    const userInput = document.getElementById('cinebot-user-input');
    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendCinebotMessage();
            }
        });
    }
});

// Hacer las funciones disponibles globalmente
window.sendCinebotMessage = sendCinebotMessage;
window.clearCinebotChat = clearCinebotChat; 