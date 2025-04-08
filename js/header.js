async function initHeader() {
  const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNDdiN2E2OWFiZjcyMDk1OWZlNGZlZmI0ZDk1NmIyZiIsIm5iZiI6MTc0MzUwODg3NC41Miwic3ViIjoiNjdlYmQ1OGFkOTk4MWZkYTE4N2FiMThiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.AFTSgit9VCyrI73TyetYSx-R25OF19oC1ICganpp4Lw';

  const HEADERS = {
    'accept': 'application/json',
    'Authorization': `Bearer ${BEARER_TOKEN}`
  };

  setupHamburgerMenu();
  await loadGenresIntoMenu();

  // Scroll suave global para todos los enlaces a géneros
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#genre-"]');
    if (link) {
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        event.preventDefault();
        const offset = targetElement.getBoundingClientRect().top + window.scrollY;
        const headerHeight = window.innerWidth <= 768 ? 215 : 100;
        window.scrollTo({ top: offset - headerHeight, behavior: 'smooth' });
      }
    }
  });

  async function loadGenresIntoMenu() {
    try {
      const genres = await fetchGenres();
      const limitedGenres = genres.slice(0, 5);
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

  function setupHamburgerMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const menuList = document.getElementById('menu-list');

    if (!menuToggle || !menuList) {
      console.error('❌ No se encontraron los elementos del menú hamburguesa');
      return;
    }

    let menuOpen = false;

    menuToggle.addEventListener('click', () => {
      menuOpen = !menuOpen;
      menuList.classList.toggle('hidden', !menuOpen);
    });

    document.addEventListener('click', (event) => {
      if (
        !menuToggle.contains(event.target) &&
        !menuList.contains(event.target)
      ) {
        menuList.classList.add('hidden');
        menuOpen = false;
      }
    });
  }

  async function fetchGenres() {
    const GENRES_URL = 'https://api.themoviedb.org/3/genre/movie/list?language=es-US';
    try {
      const response = await fetch(GENRES_URL, { headers: HEADERS });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      return data.genres;
    } catch (error) {
      console.error('❌ Error al obtener géneros:', error);
      return [];
    }
  }
}
