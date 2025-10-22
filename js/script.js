//  MOVIE LIBRARY PAGE - 
window.API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2OWM4YWRiNmE3NGIyZDViNTA1MmE3ZjBlMTA0NDA1ZiIsIm5iZiI6MTc1ODI5Mjg1NS43NzEwMDAxLCJzdWIiOiI2OGNkNmI3NzI1NjVlMzcxOTMxNDk2NDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.AoEE9Ow4n3Zun2dAOqNR-kWFa3MW5RQ3DWYzRGSuZOc';
const IMG = "https://image.tmdb.org/t/p/w500";

// Wait for DOM to be ready before running
document.addEventListener('DOMContentLoaded', async function() {
    
    // Check if we're on the movie library page
    if (document.querySelector('.movieCard')) {
        console.log("Loading movie library...");
        await loadMovieLibrary();
    }
    
    // Check if we're on the individual movie page
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('movieId');
    if (movieId) {
        console.log("Loading individual movie...");
        await loadIndividualMovie(movieId);
    }
    
    // Setup interactions after content loads
    setupInteractions();
});

// MOVIE LIBRARY LOADING
async function loadMovieLibrary() {
    const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_TOKEN}`
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        
        console.log("TMDB Data:", data);

        // Update all the movie cards with the data
        if (data.results && data.results.length > 0) {
            const cards = document.querySelectorAll('.movieCard');
            
            // Use a slight delay to ensure DOM is fully ready
            setTimeout(() => {
                cards.forEach((card, index) => {
                    if (data.results[index]) {
                        const movie = data.results[index];
                        updateMovieCard(card, movie, index);
                    }
                });
                console.log("Movie library loaded successfully!");
            }, 100);
        } else {
            console.log("No movie data found");
        }
    } catch (error) {
        console.error("Error loading movie library:", error);
    }
}

// Function to update individual movie card
function updateMovieCard(card, movie, index) {
    console.log(`Updating card ${index} with: ${movie.title}`);
    
    // Check if card has .moviePoster div or needs one created
    let posterImg = card.querySelector('.moviePoster img');
    
    if (!posterImg) {
        // Card doesn't have .moviePoster div, so create it
        const moviePosterDiv = document.createElement('div');
        moviePosterDiv.className = 'moviePoster';
        
        const img = document.createElement('img');
        img.src = '';
        moviePosterDiv.appendChild(img);
        
        // Insert at the beginning of the card (before button)
        card.insertBefore(moviePosterDiv, card.firstChild);
        
        posterImg = img;
        console.log(`Created .moviePoster div for card ${index}`);
    }
    
    if (posterImg && movie.poster_path) {
        const newSrc = IMG + movie.poster_path;
        console.log(`Setting image ${index} to:`, newSrc);
        
        posterImg.src = newSrc;
        posterImg.alt = movie.title;
        
        posterImg.onload = function() {
            console.log(`Image ${index} loaded successfully`);
        };
        
        posterImg.onerror = function() {
            console.error(`Image ${index} failed to load`);
        };
        
        console.log(`Image ${index} src after update:`, posterImg.src);
    } else {
        console.error('Could not create poster img or no poster_path in card', index);
    }
    
    // Update title (it's inside the <h3> tag)
    const titleElement = card.querySelector('.movie-title h3');
    if (titleElement) {
        titleElement.textContent = movie.title;
    } else {
        console.error('Title element not found in card', index);
    }
    
    // Update description (it's the <p> with class card-text)
    const descElement = card.querySelector('.card-text');
    if (descElement) {
        descElement.textContent = movie.overview ? movie.overview.substring(0, 100) + '...' : 'No description available.';
    } else {
        console.error('Description element not found in card', index);
    }
    
    // Update link
    const linkElement = card.querySelector('.movie-title');
    if (linkElement) {
        linkElement.href = `../pages/individualMovie/movie-template.html?movieId=${movie.id}`;
    }
}

//  INDIVIDUAL MOVIE PAGE 
async function loadIndividualMovie(movieId) {
    console.log("Loading movie ID:", movieId);
    
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_TOKEN}`
        }
    };

    try {
        // Load movie details
        const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
        const movieResponse = await fetch(movieUrl, options);
        const movieData = await movieResponse.json();
        
        console.log("Movie Data:", movieData);

        // Load movie credits
        const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`;
        const creditsResponse = await fetch(creditsUrl, options);
        const creditsData = await creditsResponse.json();
        
        console.log("Credits Data:", creditsData);

        // Update the page with movie data
        if (movieData) {
            // Update poster
            const posterElement = document.getElementById('individualPoster');
            if (posterElement) {
                posterElement.src = movieData.poster_path ? IMG + movieData.poster_path : '../../assets/images/default-poster.jpg';
                posterElement.alt = movieData.title;
            }
            
            // Update title
            const titleElement = document.getElementById('individualTitle');
            if (titleElement) {
                titleElement.textContent = movieData.title || 'Title unavailable';
            }
            
            // Update rating
            const ratingElement = document.getElementById('rating');
            if (ratingElement) {
                const rating = movieData.vote_average ? movieData.vote_average.toFixed(1) : 'N/A';
                ratingElement.innerHTML = `<img src="../../assets/icons/starIcon.png" style="height:15px" alt="Star"> ${rating}`;
            }
            
            // Update year
            const yearElement = document.getElementById('year');
            if (yearElement) {
                yearElement.textContent = movieData.release_date ? movieData.release_date.slice(0, 4) : 'N/A';
            }
            
            // Update genre
            const genreElement = document.getElementById('genre');
            if (genreElement) {
                genreElement.textContent = movieData.genres && movieData.genres[0] ? movieData.genres[0].name : 'Genre N/A';
            }
            
            // Update description
            const descElement = document.getElementById('movieDesc');
            if (descElement) {
                descElement.textContent = movieData.overview || 'No description available.';
            }
        }

        // Update actors
        if (creditsData && creditsData.cast) {
            const actorElements = document.querySelectorAll('.movie-actors p.actor');
            const actors = creditsData.cast.slice(0, 4);
            
            actorElements.forEach((element, index) => {
                if (actors[index]) {
                    element.textContent = actors[index].name + (index < 3 ? ',' : '');
                }
            });
        }
        
        console.log("Individual movie page loaded!");
        
    } catch (error) {
        console.error("Error loading individual movie:", error);
    }
}

//  INTERACTIONS 
function setupInteractions() {
    console.log("Setting up interactions...");
    
    // Icon interactions
    document.querySelectorAll(".watchlistIcon, .watchlistIconFeature, .watchButton").forEach((icon) => {
        let isActive = false;
        
        icon.addEventListener("mouseenter", () => {
            if (!isActive && icon.dataset.hover) {
                icon.src = icon.dataset.hover;
            }
        });
        
        icon.addEventListener("mouseleave", () => {
            if (!isActive && icon.dataset.default) {
                icon.src = icon.dataset.default;
            }
        });
        
        icon.addEventListener("click", () => {
            isActive = !isActive;
            icon.src = isActive ? icon.dataset.active : icon.dataset.default;
        });
    });
    
    // Card animations (only if jQuery is loaded)
    if (typeof $ !== 'undefined') {
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
    }
}