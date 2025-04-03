document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const menuList = document.getElementById("menu-list");

    // Toggle visibility of the menu
    menuToggle.addEventListener("click", () => {
        menuList.classList.toggle("hidden");
        menuList.classList.toggle("visible");
    });

    // Fetch genres from the API
    fetch("https://api.example.com/genres") // Cambia esta URL por la de tu API
        .then(response => response.json())
        .then(data => {
            // Populate the menu with genres
            data.genres.forEach(genre => {
                const listItem = document.createElement("li");
                listItem.textContent = genre.name;
                listItem.addEventListener("click", () => {
                    // Navigate to the selected genre
                    window.location.href = `./genre.html?genre=${genre.id}`;
                });
                menuList.appendChild(listItem);
            });
        })
        .catch(error => console.error("Error fetching genres:", error));
});