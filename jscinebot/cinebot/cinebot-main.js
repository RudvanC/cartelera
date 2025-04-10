import { addMessage, getMessageHistory, loadConversation, saveConversation, resetHistory } from './cinebot-chatHistory.js';
import { displayMessage, showTypingIndicator, hideTypingIndicator, clearChatContainer, handleError } from './cinebot-ui.js';
import { sendMessageToMistral } from './cinebot-api.js';

// Variables para el widget
let isChatVisible = false;
let chatContainer;
let toggleButton;
let minimizeButton;
let userInput;

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
    if (!userInput) {
        userInput = document.getElementById('cinebot-user-input');
    }
    
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

// Inicializar el CineBot
export function init() {
    console.log('Inicializando CineBot...');
    
    // Obtener elementos del DOM
    chatContainer = document.getElementById('cinebot-chat');
    toggleButton = document.getElementById('cinebot-toggle-button');
    minimizeButton = document.getElementById('cinebot-minimize');
    userInput = document.getElementById('cinebot-user-input');
    
    if (!chatContainer || !toggleButton || !minimizeButton || !userInput) {
        console.error('No se pudieron encontrar los elementos del DOM para CineBot');
        return;
    }
    
    // Configurar eventos del widget
    toggleButton.addEventListener('click', toggleChat);
    minimizeButton.addEventListener('click', minimizeChat);
    
    // Añadir el evento de tecla Enter al input
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendCinebotMessage();
        }
    });
    
    const savedHistory = loadConversation();
    if (savedHistory && savedHistory.length > 1) {
        // Si hay historial guardado (más que solo el mensaje del sistema), lo mostramos
        savedHistory.forEach(msg => {
            if (msg.role !== 'system') {
                displayMessage(msg.content, msg.role === 'user' ? 'cinebot-user-message' : 'cinebot-bot-message');
            }
        });
    } else {
        // Si no hay historial o solo está el mensaje del sistema, mostramos el mensaje de bienvenida
        clearChatContainer(); // Limpiamos por si acaso
        resetHistory(); // Aseguramos que el historial está limpio
        // Añadir el mensaje de bienvenida al historial
        addMessage('assistant', '¡Hola! 👋 Soy CineBot, tu asistente virtual. ¿En qué puedo ayudarte hoy? Puedo hablar sobre cine o recomendarte algunas películas interesantes 🎬');
        // Mostrar el mensaje de bienvenida
        displayMessage('¡Hola! 👋 Soy CineBot, tu asistente virtual. ¿En qué puedo ayudarte hoy? Puedo hablar sobre cine o recomendarte algunas películas interesantes 🎬', 'cinebot-bot-message');
        saveConversation();
    }
    
    console.log('CineBot inicializado correctamente');
}

// Hacer las funciones disponibles globalmente para poder ser usadas desde HTML
window.sendCinebotMessage = sendCinebotMessage;
window.clearCinebotChat = clearCinebotChat;

// Exportar las funciones para uso modular
export { 
    sendCinebotMessage,
    clearCinebotChat,
    toggleChat,
    minimizeChat
}; 