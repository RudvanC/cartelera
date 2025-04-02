document.addEventListener("DOMContentLoaded", () => {
  const API_URL = 'https://api.themoviedb.org/3/movie/popular?include_adult=false&language=es-US&page=1';
  const options = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNDdiN2E2OWFiZjcyMDk1OWZlNGZlZmI0ZDk1NmIyZiIsIm5iZiI6MTc0MzUwODg3NC41Miwic3ViIjoiNjdlYmQ1OGFkOTk4MWZkYTE4N2FiMThiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.AFTSgit9VCyrI73TyetYSx-R25OF19oC1ICganpp4Lw', // Reemplaza con tu API Key
      'accept': 'application/json'
    }
  };

  const MOVIES_LIMIT = 5;

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
    if (!container) {
      console.error("❌ No se encontró el contenedor con id 'slider'");
      return;
    }
    
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
          <p>${movie.overview.substring(0, 1000)}...</p>
          <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank" class="btn">Ver Más</a>
        </div>
      `;
      container.appendChild(movieElement);
    });

    initSlider();
  }

  function initSlider() {
    const sliderContainer = document.getElementById("slider");
    if (!sliderContainer) {
      console.error("❌ No se encontró el contenedor con id 'slider'");
      return;
    }

    const slides = document.querySelectorAll(".slide");
    const totalSlides = slides.length;
    let currentIndex = 0;

    function showSlide(index) {
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

    document.getElementById("prev").addEventListener("click", prevSlide);
    document.getElementById("next").addEventListener("click", nextSlide);

    setInterval(nextSlide, 3000);
    showSlide(currentIndex);
  }

  window.fetchPopularMovies = fetchPopularMovies; // Hace la función accesible globalmente
  fetchPopularMovies();
});
