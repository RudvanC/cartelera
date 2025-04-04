import MovieChatbot from '../js/movie-chatbot.js';
        
        // Inicializar el chatbot
        const chatbot = new MovieChatbot();
        const chatContainer = document.getElementById('chat-container');
        const userInput = document.getElementById('user-input');
        const sendButton = document.getElementById('send-button');
        
        // Función para añadir mensaje al chat
        function addMessage(message, isUser) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
            messageDiv.textContent = message;
            
            chatContainer.appendChild(messageDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
        
        // Función para manejar el envío de mensajes
        async function handleSend() {
            const message = userInput.value.trim();
            if (!message) return;
            
            // Añadir mensaje del usuario
            addMessage(message, true);
            userInput.value = '';
            
            // Mostrar indicador de carga
            const loadingDiv = document.createElement('div');
            loadingDiv.classList.add('message', 'bot-message');
            const loadingIndicator = document.createElement('div');
            loadingIndicator.classList.add('loading');
            loadingDiv.appendChild(document.createTextNode('Pensando '));
            loadingDiv.appendChild(loadingIndicator);
            chatContainer.appendChild(loadingDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            try {
                // Procesar mensaje y obtener respuesta
                const response = await chatbot.processMessage(message);
                
                // Eliminar indicador de carga
                chatContainer.removeChild(loadingDiv);
                
                // Añadir respuesta del bot
                addMessage(response, false);
            } catch (error) {
                console.error('Error processing message:', error);
                
                // Eliminar indicador de carga
                chatContainer.removeChild(loadingDiv);
                
                // Mostrar mensaje de error
                addMessage('Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.', false);
            }
        }
        
        // Event listeners
        sendButton.addEventListener('click', handleSend);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSend();
            }
        });