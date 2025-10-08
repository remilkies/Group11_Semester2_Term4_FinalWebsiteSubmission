// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // BOOKMARK, WISHLIST, ICON HOVER + CLICK ACTIVE + TOGGLER
    const iconBookmarks = document.querySelectorAll(".watchlistIconFeature, .watchlistIcon");
    
    iconBookmarks.forEach((iconBookmark) => {
        let isActive = false;
        
        // Add hover effects
        iconBookmark.addEventListener("mouseenter", () => {
            if (!isActive && iconBookmark.dataset.hover) {
                iconBookmark.src = iconBookmark.dataset.hover;
            }
        });

        iconBookmark.addEventListener("mouseleave", () => {
            if (!isActive && iconBookmark.dataset.default) {
                iconBookmark.src = iconBookmark.dataset.default;
            }
        });

        // Toggle active state
        iconBookmark.addEventListener("click", () => {
            isActive = !isActive;
            if (isActive && iconBookmark.dataset.active) {
                iconBookmark.src = iconBookmark.dataset.active;
            } else if (!isActive && iconBookmark.dataset.default) {
                iconBookmark.src = iconBookmark.dataset.default;
            }
        });
    });

    // Watch button toggle
    const watchButtons = document.querySelectorAll(".watchButton");
    
    watchButtons.forEach((watchButton) => {
        let isActive = false;

        watchButton.addEventListener("click", () => {
            isActive = !isActive;
            if (isActive && watchButton.dataset.active) {
                watchButton.src = watchButton.dataset.active;
            } else if (!isActive && watchButton.dataset.default) {
                watchButton.src = watchButton.dataset.default;
            }
        });
    });

    // Card expand animation (using jQuery)
    $(".movieCard").on("mouseenter", function() {
        const card = $(this);
        
        card.animate({width: '600px'}, 500);
        card.css("z-index", 10);
        card.css("scale", 1.15);
    });

    $(".movieCard").on("mouseleave", function() {
        const card = $(this);

        card.animate({width: '222px'}, 100);
        card.css("scale", 1);
        
        setTimeout(() => {
            card.css("z-index", 1);
        }, 100);
    });

    // Movie class
    class Movies {
        constructor(poster, title, rating, year, genre, description, actors) {
            this.poster = poster;
            this.title = title;
            this.rating = rating;
            this.year = year;
            this.genre = genre;
            this.description = description;
            this.actors = actors;
        }
    }

    // API configuration
    const API_OPTIONS = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZDE2OWZkMTg5MDg0NGZkNGZiMGMzYmI5YWIzOTkzMCIsIm5iZiI6MTc1OTQwNzA5MC41NDcwMDAyLCJzdWIiOiI2OGRlNmJmMjJkMGI0YTkwYjZkYTU3OWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.H3q6GBug0aWNLQPpsTml0iQE9AAWo8QJzI2GBSxWuP4'
        }
    };

    // Fetch movie data
    async function fetchMovieData() {
        try {
            const movieUrl = 'https://api.themoviedb.org/3/movie/617126?language=en-US';
            const creditsUrl = 'https://api.themoviedb.org/3/movie/617126/credits?language=en-US';

            // Fetch both movie data and credits in parallel
            const [movieResponse, creditsResponse] = await Promise.all([
                fetch(movieUrl, API_OPTIONS),
                fetch(creditsUrl, API_OPTIONS)
            ]);

            const movieData = await movieResponse.json();
            const creditsData = await creditsResponse.json();

            // Process movie data
            processMovieData(movieData);
        
            processCreditsData(creditsData);

        } catch (error) {
            console.error('Error fetching data:', error);
            // You might want to show an error message to the user
        }
    }

    function processMovieData(data) {
        const poster = data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : '../../assets/images/default-poster.jpg';
        const title = data.original_title || "Title not available";
        const rating = data.vote_average || "N/A";
        const year = data.release_date ? data.release_date.slice(0, 4) : "Year not available";
        const genre = data.genres && data.genres[0] ? data.genres[0].name : "Genre not available";
        const description = data.overview || "Description not available";

        const individualMovie = new Movies(poster, title, rating, year, genre, description);

        console.log('Movie data:', individualMovie);

        // Update DOM elements
        updateMovieDOM(individualMovie);
    }

    function updateMovieDOM(movie) {
        const safeUpdate = (elementId, content) => {
            const element = document.getElementById(elementId);
            if (element) element.innerHTML = content;
        };

        safeUpdate('individualTitle', movie.title);
        safeUpdate('rating', `<img src="../../assets/icons/starIcon.png" style="height: 15px"> ${movie.rating.toFixed(1)}`);
        safeUpdate('year', movie.year);
        safeUpdate('genre', movie.genre);
        safeUpdate('movieDesc', movie.description);

        const posterElement = document.getElementById('individualPoster');
        if (posterElement) posterElement.src = movie.poster;
    }

    function processCreditsData(data) {
        const cast = data.cast || [];
        const actors = cast.slice(0, 4).map(actor => actor.name || "Actor name not available");

        updateCreditsDOM(actors);
    }

    function updateCreditsDOM(actors) {
        const safeUpdate = (elementId, content) => {
            const element = document.getElementById(elementId);
            if (element) element.innerHTML = content;
        };

        // Update actor elements if they exist
        actors.forEach((actor, index) => {
            safeUpdate(`actor${index === 0 ? '' : index}`, actor);
        });
    }

    // Initialize the application
    fetchMovieData();
});