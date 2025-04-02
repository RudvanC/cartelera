document.addEventListener("DOMContentLoaded", () => {
  const API_URL = 'https://api.themoviedb.org/3/movie/popular?include_adult=false&language=en-US&page=1';
  const options = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer TU_API_KEY', // Reemplaza con tu API Key
      'accept': 'application/json'
    }
  };

  const MOVIES_LIMIT = 5; // Cambia este número para mostrar la cantidad deseada de películas

  async function fetchPopularMovies() {
    try {
      const response = await fetch(API_URL, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      showMovies(data.results);
    } catch (error) {
      console.error('Error al obtener las películas populares:', error);
    }
  }

  function showMovies(movies) {
    const container = document.getElementById('slider');
    container.innerHTML = '';
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w1280';
    const moviesToShow = movies.slice(0, MOVIES_LIMIT);

    moviesToShow.forEach((movie) => {
      const movieElement = document.createElement('div');
      movieElement.classList.add('slide');
      movieElement.innerHTML = `
        <img class="slide-image" src="${IMAGE_BASE_URL}${movie.backdrop_path}" alt="${movie.title}">
        <div class="slide-info">
          <h3>${movie.title}</h3>
          <h4>⭐ ${movie.vote_average.toFixed(1)}</h4>
          <p>${movie.overview.substring(0, 200)}...</p>
          <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank" class="btn">Ver Más</a>
        </div>
      `;
      container.appendChild(movieElement);
    });

    initSlider();
  }

  function initSlider() {
    const sliderContainer = document.getElementById("slider");
    const slides = document.querySelectorAll(".slide");
    const totalSlides = slides.length;
    let currentIndex = 0;

    function showSlide(index) {
      // Se traslada el contenedor para mostrar el slide deseado
      sliderContainer.style.transform = `translateX(-${index * 100}%)`;
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % totalSlides;
      showSlide(currentIndex);
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      showSlide(currentIndex);
    }

    // Eventos para controles manuales
    document.getElementById("prev").addEventListener("click", prevSlide);
    document.getElementById("next").addEventListener("click", nextSlide);

    // Cambio automático cada 8 segundos
    setInterval(nextSlide, 3000);

    // Mostrar el primer slide
    showSlide(currentIndex);
  }

  fetchPopularMovies();
});
