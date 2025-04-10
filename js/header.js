async function initHeader() { // Configura el menú de navegación
  const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNDdiN2E2OWFiZjcyMDk1OWZlNGZlZmI0ZDk1NmIyZiIsIm5iZiI6MTc0MzUwODg3NC41Miwic3ViIjoiNjdlYmQ1OGFkOTk4MWZkYTE4N2FiMThiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.AFTSgit9VCyrI73TyetYSx-R25OF19oC1ICganpp4Lw';
  // Aquí se guarda el token de autorización 

  const HEADERS = { // Son las cabeceras que se mandarán a las peticiones
    'accept': 'application/json',
    'Authorization': `Bearer ${BEARER_TOKEN}`
  };

  setupHamburgerMenu(); // Activa el menú 
  await loadGenresIntoMenu(); //Carga los géneros en el menú

  // Hace un scroll suave al hacer clic en los enlaces del menú
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#genre-"]');
    if (link) {
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        event.preventDefault();
        const offset = targetElement.getBoundingClientRect().top + window.scrollY;
        const headerHeight = window.innerWidth <= 768 ? 215 : 285; // Ajustar según el tamaño de la pantalla
        window.scrollTo({ top: offset - headerHeight, behavior: 'smooth' });
      }
    }
  });

  // Llama a fetchGenres() para pedir los géneros a la API
  async function loadGenresIntoMenu() {
    try {
      const genres = await fetchGenres();
      const limitedGenres = genres.slice(0, 5); // Coge los 5 primeros
      const menuList = document.getElementById('menu-list');
      if (!menuList) {
        console.error('❌ No se encontró el elemento menu-list');
        return;
      }

      menuList.innerHTML = ''; // Limpiar

      limitedGenres.forEach((genre) => {
        const menuItem = document.createElement('li');
        const link = document.createElement('a');

        link.href = `#genre-${genre.id}`;
        link.textContent = genre.name;

        // Solo cerrar el menú al hacer clic (scroll se maneja globalmente)
        link.addEventListener('click', () => {
          menuList.classList.add('hidden');
        });

        menuItem.appendChild(link);
        menuList.appendChild(menuItem);
      });

    } catch (error) {
      console.error('❌ Error al cargar los géneros:', error);
    }
  }

  function setupHamburgerMenu() { // Configura el menú hamburguesa
    const menuToggle = document.getElementById('menu-toggle');
    const menuList = document.getElementById('menu-list');

    if (!menuToggle || !menuList) {
      console.error('❌ No se encontraron los elementos del menú hamburguesa');
      return;
    }

    let menuOpen = false;

    menuToggle.addEventListener('click', () => { // Si haces clic en el botón #menu-toggle, muestra u oculta el menú
      menuOpen = !menuOpen;
      menuList.classList.toggle('hidden', !menuOpen);
    });

    document.addEventListener('click', (event) => { // Si haces clic fuera del menú, lo cierra  
      if (
        !menuToggle.contains(event.target) &&
        !menuList.contains(event.target)
      ) {
        menuList.classList.add('hidden');
        menuOpen = false;
      }
    });
  }

  async function fetchGenres() { // Pide los géneros a la API
    const GENRES_URL = 'https://api.themoviedb.org/3/genre/movie/list?language=es-US';
    try {
      const response = await fetch(GENRES_URL, { headers: HEADERS }); //Usa el token en las cabeceras
      if (!response.ok) throw new Error(`Error: ${response.status}`); //Si todo ok, devuelve un array con los géneros, si no, manda un error en la consola y devuelve un array vacío
      const data = await response.json();
      return data.genres;
    } catch (error) {
      console.error('❌ Error al obtener géneros:', error);
      return [];
    }
  }
}
