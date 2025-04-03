document.addEventListener("DOMContentLoaded", () => {
    initHeader();
  });
  
  async function initHeader() {
    // Configuración del token de autenticación y headers
    const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNDdiN2E2OWFiZjcyMDk1OWZlNGZlZmI0ZDk1NmIyZiIsIm5iZiI6MTc0MzUwODg3NC41Miwic3ViIjoiNjdlYmQ1OGFkOTk4MWZkYTE4N2FiMThiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.AFTSgit9VCyrI73TyetYSx-R25OF19oC1ICganpp4Lw';
    const HEADERS = {
      'accept': 'application/json',
      'Authorization': `Bearer ${BEARER_TOKEN}`
    };
  
    // Cargar el header
    await loadHeader();
    
    // Configurar el menú hamburguesa
    setupHamburgerMenu();
    
    // Cargar los géneros en el menú
    await loadGenresIntoMenu();
    
    // Función para cargar el header desde el archivo HTML
    async function loadHeader() {
      try {
        const response = await fetch('../components/header.html');
        const html = await response.text();
        const headerContainer = document.querySelector('.header header');
        headerContainer.innerHTML = html;

        // Reconfigurar eventos después de cargar el header
        setupHamburgerMenu();
        await loadGenresIntoMenu();
      } catch (error) {
        console.error('Error al cargar el header:', error);
      }
    }
    
    // Configurar el comportamiento del menú hamburguesa
    function setupHamburgerMenu() {
      const menuToggle = document.getElementById('menu-toggle');
      const menuList = document.getElementById('menu-list');
      
      if (menuToggle && menuList) {
        menuToggle.addEventListener('click', () => {
          menuList.classList.toggle('hidden');
        });
      } else {
        console.error('❌ No se encontraron los elementos del menú hamburguesa');
      }
    }
    
    // Cargar los géneros en el menú
    async function loadGenresIntoMenu() {
      try {
        const genres = await fetchGenres();
        const limitedGenres = genres.slice(0, 5); // Limitamos a 3 géneros como pediste
        const menuList = document.getElementById('menu-list');
        
        if (!menuList) {
          console.error('❌ No se encontró el elemento menu-list');
          return;
        }
        
        menuList.innerHTML = ''; // Limpiar el menú
        
        // Añadir los géneros al menú
        limitedGenres.forEach(genre => {
          const menuItem = document.createElement('li');
          const link = document.createElement('a');
          link.href = `#genre-${genre.id}`;
          link.textContent = genre.name;
          
          // Añadir evento para cerrar el menú al hacer clic
          link.addEventListener('click', (e) => {
            menuList.classList.add('hidden');
            
            // Scroll suave hasta la sección
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
              e.preventDefault();
              targetElement.scrollIntoView({ behavior: 'smooth' });
            }
          });
          
          menuItem.appendChild(link);
          menuList.appendChild(menuItem);
        });
        
      } catch (error) {
        console.error('Error al cargar los géneros en el menú:', error);
      }
    }
    
    // Función para obtener los géneros de la API
    async function fetchGenres() {
      const GENRES_URL = 'https://api.themoviedb.org/3/genre/movie/list?language=es-US';
      try {
        const response = await fetch(GENRES_URL, { headers: HEADERS });
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        return data.genres;
      } catch (error) {
        console.error('Error al obtener géneros:', error);
        return [];
      }
    }
  }