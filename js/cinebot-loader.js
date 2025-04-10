/**
 * Módulo para cargar y gestionar el componente CineBot
 */

// Función para cargar el componente CineBot
export async function loadCinebot() {
    try {
        // Cargar HTML del componente
        const response = await fetch('./components/cinebot.html');
        const html = await response.text();
        
        // Crear un contenedor para el CineBot e insertarlo en el body
        const cinebotContainer = document.createElement('div');
        cinebotContainer.id = 'cinebot-container';
        cinebotContainer.innerHTML = html;
        document.body.appendChild(cinebotContainer);
        
        // Cargar los estilos
        if (!document.querySelector('link[href="./jscinebot/cinebot/cinebot-styles.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = './jscinebot/cinebot/cinebot-styles.css';
            document.head.appendChild(link);
        }
        
        // Inicializar el CineBot
        await initCinebot();
    } catch (error) {
        console.error('Error al cargar el componente CineBot:', error);
    }
}

// Función para inicializar la funcionalidad del CineBot
async function initCinebot() {
    // Asegurarse de que los scripts necesarios estén cargados
    if (!document.querySelector('script[src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"]')) {
        await loadScript('https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js');
    }
    
    // Importar el script principal del CineBot e inicializarlo
    try {
        const cinebotModule = await import('../jscinebot/cinebot/cinebot-main.js');
        cinebotModule.init();
        console.log('CineBot inicializado correctamente');
    } catch (error) {
        console.error('Error al inicializar CineBot:', error);
    }
}

// Función auxiliar para cargar un script de forma asíncrona
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

// Exportar las funciones principales
export default {
    loadCinebot
}; 