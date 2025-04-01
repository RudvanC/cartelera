const API_KEY = 'f4534d64dc687f4f71b9fb136576e34f';
const URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=es-ES&page=1`;

async function obtenerPeliculas() {
  try {
    const response = await fetch(URL);
    const data = await response.json();
    mostrarPeliculas(data.results.slice(0, 3)); // Obtener las primeras 9 películas
  } catch (error) {
    console.error('Error:', error);
  }
}

function mostrarPeliculas(peliculas) {
  const contenedor = document.getElementById('peliculas-container');
  contenedor.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevas películas

  peliculas.forEach(pelicula => {
    const div = document.createElement('div');
    div.classList.add('pelicula');
    div.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${pelicula.poster_path}" alt="${pelicula.title}">
      <h3>${pelicula.title}</h3>
    `;
    contenedor.appendChild(div);
  });
}

obtenerPeliculas();
