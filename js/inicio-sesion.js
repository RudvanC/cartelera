// key-auth.js
document.addEventListener('DOMContentLoaded', () => {
    // La clave correcta (en una aplicación real, esto debería estar en el servidor)
    const correctKey = 'https://dev-rcjqwa7wkimbhubj.us.auth0.com/api/v2/';
    
    // Comprueba si ya hay una sesión activa (usando localStorage)
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (isAuthenticated) {
      showApp();
    } else {
      showLoginForm();
    }
    
    // Configurar el formulario de login
    document.getElementById('key-form').addEventListener('submit', (e) => {
      e.preventDefault();
      
      const keyInput = document.getElementById('key-input').value;
      
      if (keyInput === correctKey) {
        // Guardar estado de autenticación
        localStorage.setItem('isAuthenticated', 'true');
        showApp();
      } else {
        document.getElementById('error-message').textContent = 'Clave incorrecta. Inténtalo de nuevo.';
      }
    });
    
    // Configurar el botón de logout
    document.getElementById('btn-logout').addEventListener('click', () => {
      localStorage.removeItem('isAuthenticated');
      showLoginForm();
    });
    
    function showApp() {
      document.getElementById('login-container').style.display = 'none';
      document.getElementById('app-container').style.display = 'block';
    }
    
    function showLoginForm() {
      document.getElementById('login-container').style.display = 'block';
      document.getElementById('app-container').style.display = 'none';
    }
  });