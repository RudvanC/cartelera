import { API_CONFIG } from '../config.js';  // Contiene claves o cabeceras para hacer peticiones a la API
import { movieLimit } from '../config.js'; // Limita la cantidad de géneros que se mostrarán en el menú

export async function initHeader() {  // Esta funciín se llama desde script.js
  setupHamburgerMenu(); // Activa el menú hamburguesa.
  await loadGenresIntoMenu(); // Carga los géneros en el menú

  // Hace un scroll suave al hacer clic en los enlaces del menú
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#genre-"]'); // Busca enlaces que comiencen con #genre-
    if (link) {
      const targetId = link.getAttribute('href').substring(1); // Obtiene el ID del elemento destino
      const targetElement = document.getElementById(targetId); // Busca en el DOM el elemento que tenga ese ID
      if (targetElement) { // Si existe el elemento destino
        event.preventDefault(); // Evita el comportamiento por defecto del enlace
        const offset = targetElement.getBoundingClientRect().top + window.scrollY; // Calcula la posición del elemento destino
        // Ajusta la posición del scroll para que el elemento quede visible
        const headerHeight = window.innerWidth <= 768 ? 215 : 285; // Ajustar según el tamaño de la pantalla
        window.scrollTo({ top: offset - headerHeight, behavior: 'smooth' }); // Desplazamiento suave
      }
    }
  });
}

// Esta función carga los géneros de películas en el menú hamburguesa
// y los muestra en el menú hamburguesa.
async function loadGenresIntoMenu() {
  try {
    const genres = await fetchGenres(); // Se conecta a la API de The Movie Database (TMDB) para obtener los géneros
    const limitedGenres = genres.slice(0, movieLimit); // Limita la cantidad de géneros que se muestran.
    const menuList = document.getElementById('menu-list'); // Busca el elemento <ul> del menú hamburguesa en HTML
    if (!menuList) { // Comprueba que menuList existe
      // Si no existe, muestra un error en la consola y sale de la función para evitar errores posteriores
      console.error('❌ No se encontró el elemento menu-list');
      return;
    }

    menuList.innerHTML = ''; // Limpiar. Antes de meter los géneros, limpia el contenido anterior (por si se vuelve a llamar esta función más de una vez)


    // La parte donde realmente se crean y se insertan los géneros en el menú

    limitedGenres.forEach((genre) => { // Rrecorre el array limitedGenres y por cada género crea un enlace en el menú
      const menuItem = document.createElement('li'); // Crea un nuevo elemento <li> para cada género
      const link = document.createElement('a'); // Crea un nuevo elemento <a> para cada género

      link.href = `#genre-${genre.id}`; // El enlace apunta a un ID que existe en el DOM
      link.textContent = genre.name; // Le da un texto visible al enlace, como “Acción”, “Comedia”...

      // Cuando el usuario hace clic en un enlace del menú, se oculta el menú 
      link.addEventListener('click', () => {
        menuList.classList.add('hidden');
      });
       // Une los elementos <li> y <a> para que el enlace esté dentro de la lista
      menuItem.appendChild(link); // Mete el enlace (<a>) dentro del <li>
      menuList.appendChild(menuItem); // Luego mete ese <li> dentro del menú (<ul>)
    });

  } catch (error) { // Si hay un error al cargar los géneros, lo captura y muestra un mensaje en la consola
    // Esto es útil si falla la conexión con la API o si hay un problema con la respuesta
    console.error('❌ Error al cargar los géneros:', error);
  }
}

// Esta parte gestiona el comportamiento del menú hamburguesa
function setupHamburgerMenu() {
  const menuToggle = document.getElementById('menu-toggle'); // Busca en el HTML el botón que el usuario va a pulsar para abrir o cerrar el menú
  const menuList = document.getElementById('menu-list'); // El contenedor <ul> del menú.

  // Comprueba que ambos elementos existen. Si no están en el HTML, muestra un error en la consola y sale de la función
  if (!menuToggle || !menuList) {
    console.error('❌ No se encontraron los elementos del menú hamburguesa');
    return;
  }

  let menuOpen = false; // Crea una flag para saber si el menú está abierto (true) o cerrado (false)

  // Añade un evento al botón del menú hamburguesa para alternar la visibilidad del menú
  // Cuando el usuario hace clic en el botón, cambia el estado del menú (abierto o cerrado)
  menuToggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    menuList.classList.toggle('hidden', !menuOpen);
  });

  // Añade un evento al documento para cerrar el menú si se hace clic fuera de él
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

// Esta función se conecta a la API de The Movie Database (TMDB) para obtener los géneros de películas
// y devuelve un array con los géneros disponibles.
async function fetchGenres() { // Llama a la API para obtener los géneros de las películas.
  const GENRES_URL = 'https://api.themoviedb.org/3/genre/movie/list?language=es-US';
  try {
    const response = await fetch(GENRES_URL, { headers: API_CONFIG.HEADERS }); // Hace una llamada a la URL usando fetch, y además le pasa unos headers que una clave de API necesaria para autenticar la petición
    if (!response.ok) throw new Error(`Error: ${response.status}`); // Si la respuesta no es correcta, lanza un error con el código de estado
       const data = await response.json();  // Si la respuesta es correcta, convierte la respuesta a JSON
    return data.genres;  // Devuelve el array de géneros
  } catch (error) { // Si hay un error en la petición, lo captura y muestra un mensaje en la consola
    console.error('❌ Error al obtener géneros:', error);
    return [];
  }
}
