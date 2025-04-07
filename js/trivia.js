const API_KEY = 'd47b7a69abf720959fe4fefb4d956b2f';
const BASE_URL = 'https://api.themoviedb.org/3';

async function getMovies() {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES`);
  const data = await res.json();
  return data.results;
}

function generarOpciones(correcta, peliculas) {
  const opciones = [correcta];
  while (opciones.length < 4) {
    const random = peliculas[Math.floor(Math.random() * peliculas.length)];
    if (!opciones.find(p => p.title === random.title)) {
      opciones.push(random);
    }
  }
  return opciones.sort(() => Math.random() - 0.5);
}

async function generarPregunta() {
  const peliculas = await getMovies();
  const peliCorrecta = peliculas[Math.floor(Math.random() * peliculas.length)];

  const opciones = generarOpciones(peliCorrecta, peliculas);
  const pregunta = document.getElementById('question');
  const opcionesContainer = document.getElementById('options');

  pregunta.textContent = `¿Qué película tiene esta sinopsis?\n\n"${peliCorrecta.overview}"`;

  opcionesContainer.innerHTML = '';
  opciones.forEach(p => {
    const btn = document.createElement('button');
    btn.textContent = p.title;
    btn.onclick = () => {
      alert(p.title === peliCorrecta.title ? '¡Correcto! 🎉' : 'Incorrecto 😢');
      generarPregunta();
    };
    opcionesContainer.appendChild(btn);
  });
}

generarPregunta();
