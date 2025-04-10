const apiKey = 'd47b7a69abf720959fe4fefb4d956b2f';

function getRequestToken() {
  fetch(`https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      const requestToken = data.request_token;
      window.location.href = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${window.location.href}`;
    });
}

function getSessionId(requestToken) {
  fetch(`https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ request_token: requestToken })
  })
    .then(res => res.json())
    .then(data => {
      const sessionId = data.session_id;
      localStorage.setItem('session_id', sessionId);
      getAccountDetails(sessionId);
    });
}

function getAccountDetails(sessionId) {
  fetch(`https://api.themoviedb.org/3/account?api_key=${apiKey}&session_id=${sessionId}`)
    .then(res => res.json())
    .then(data => {
      const accountId = data.id;
      localStorage.setItem('account_id', accountId);
      cargarPeliculas(); // mostrar películas después del login
    });
}

// Comprobar si ya viene el token en la URL
const urlParams = new URLSearchParams(window.location.search);
const requestToken = urlParams.get('request_token');
if (requestToken) {
  getSessionId(requestToken);
} else {
  cargarPeliculas(); // si ya hay sesión guardada
}

// Mostrar películas populares con botones de favoritos
function cargarPeliculas() {
  fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=es-ES&page=1`)
    .then(res => res.json())
    .then(data => {
      mostrarPeliculas(data.results);
    });
}

function mostrarPeliculas(peliculas) {
  const contenedor = document.getElementById('peliculas');
  contenedor.innerHTML = '';

  peliculas.forEach(pelicula => {
    const div = document.createElement('div');
    div.classList.add('pelicula');

    const button = document.createElement('button');
    button.textContent = '⭐ Añadir a favoritos';
    button.onclick = () => toggleFavorite(pelicula.id, button);

    div.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${pelicula.poster_path}" alt="${pelicula.title}">
      <h3>${pelicula.title}</h3>
    `;
    div.appendChild(button);
    contenedor.appendChild(div);

    // Verificar si ya es favorito para cambiar texto del botón
    verificarSiEsFavorito(pelicula.id, button);
  });
}

// Alternar favoritos (añadir o quitar)
function toggleFavorite(movieId, button) {
  const sessionId = localStorage.getItem('session_id');
  const accountId = localStorage.getItem('account_id');

  if (!sessionId || !accountId) {
    alert('Debes iniciar sesión primero.');
    return;
  }

  // Revisar si ya está en favoritos
  fetch(`https://api.themoviedb.org/3/account/${accountId}/favorite/movies?api_key=${apiKey}&session_id=${sessionId}`)
    .then(res => res.json())
    .then(data => {
      const esFavorito = data.results.some(p => p.id === movieId);

      fetch(`https://api.themoviedb.org/3/account/${accountId}/favorite?api_key=${apiKey}&session_id=${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_type: 'movie',
          media_id: movieId,
          favorite: !esFavorito
        })
      })
        .then(res => res.json())
        .then(() => {
          button.textContent = !esFavorito ? '❌ Quitar de favoritos' : '⭐ Añadir a favoritos';
        });
    });
}

// Cambiar texto del botón si ya es favorito
function verificarSiEsFavorito(movieId, button) {
  const sessionId = localStorage.getItem('session_id');
  const accountId = localStorage.getItem('account_id');
  if (!sessionId || !accountId) return;

  fetch(`https://api.themoviedb.org/3/account/${accountId}/favorite/movies?api_key=${apiKey}&session_id=${sessionId}`)
    .then(res => res.json())
    .then(data => {
      const esFavorito = data.results.some(p => p.id === movieId);
      if (esFavorito) {
        button.textContent = '❌ Quitar de favoritos';
      }
    });
}
