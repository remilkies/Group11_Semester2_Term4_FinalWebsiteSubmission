/*  Dream Stream – Individual Movie Page Loader
 */

// Wait for the entire page to load before running our script
document.addEventListener('DOMContentLoaded', function() {
    console.log("Page loaded, initializing movie script...");

 
    // These are the settings that control which movie we load and how we connect to the API
    const MOVIE_ID = 617126;  // The unique ID for the movie we want to display
    const API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZDE2OWZkMTg5MDg0NGZkNGZiMGMzYmI5YWIzOTkzMCIsIm5iZiI6MTc1OTQwNzA5MC41NDcwMDAyLCJzdWIiOiI2OGRlNmJmMjJkMGI0YTkwYjZkYTU3OWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.H3q6GBug0aWNLQPpsTml0aQE9AAWo8QJzI2GBSxWuP4';
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';  // Base URL for movie images

    /* INTERACTIVE ICON HANDLING  */
    // This section handles the hover and click effects for watchlist and watch buttons
    console.log("Setting up interactive icons...");
    
    // Get all the interactive icons on the page
    const interactiveIcons = document.querySelectorAll('.watchlistIcon, .watchButton');
    
    // Loop through each icon and set up its event listeners
    interactiveIcons.forEach(function(iconElement) {
        let isCurrentlyActive = false;  // Track whether this icon is in active state
        
        // When mouse hovers over the icon
        iconElement.addEventListener('mouseenter', function() {
         
            if (!isCurrentlyActive && iconElement.dataset.hover) {
                iconElement.src = iconElement.dataset.hover;
                console.log("Icon hover state activated");
            }
        });
        
        // When mouse leaves the icon
        iconElement.addEventListener('mouseleave', function() {
          
            if (!isCurrentlyActive && iconElement.dataset.default) {
                iconElement.src = iconElement.dataset.default;
                console.log("Icon returned to default state");
            }
        });
        
        // When icon is clicked
        iconElement.addEventListener('click', function() {
            // Toggle between active and inactive states
            isCurrentlyActive = !isCurrentlyActive;
            
            if (isCurrentlyActive) {
                iconElement.src = iconElement.dataset.active;
                console.log("Icon set to active state");
            } else {
                iconElement.src = iconElement.dataset.default;
                console.log("Icon set to default state");
            }
        });
    });

    /*  MOVIE CARD ANIMATIONS */
    // This uses jQuery for smooth animations when hovering over movie cards
    console.log("Setting up movie card animations...");
    
    // When mouse enters a movie card
    $('.movieCard').on('mouseenter', function() {
        const currentCard = $(this);
        console.log("Mouse entered movie card, expanding...");
        
        // Animate the card to be larger and bring it to front
        currentCard.animate({ width: '600px' }, 500);
        currentCard.css({ 
            'z-index': 10,
            'scale': 1.15
        });
    });
    
    // When mouse leaves a movie card
    $('.movieCard').on('mouseleave', function() {
        const currentCard = $(this);
        console.log("Mouse left movie card, shrinking...");
        
       
        currentCard.animate({ width: '222px' }, 100);
        currentCard.css('scale', 1);
        
   
        setTimeout(function() {
            currentCard.css('z-index', 1);
            console.log("Card animation complete");
        }, 100);
    });

    /*  MOVIE DATA LOADING  */
    // This section handles fetching movie data from the TMDB API
    console.log("Starting movie data loading process...");
    
    // Main function to load all movie data
    !async function loadMovieData() {
        console.log("loadMovieData function called");
        
        // Define the API endpoints we need to call
        const movieDetailsEndpoint = `https://api.themoviedb.org/3/movie/${MOVIE_ID}?language=en-US`;
        const movieCreditsEndpoint = `https://api.themoviedb.org/3/movie/${MOVIE_ID}/credits?language=en-US`;
        
        // Set up the request options with our authorization
        const requestOptions = {
            method: 'GET',
            headers: { 
                'accept': 'application/json',
                'Authorization': `Bearer ${API_TOKEN}`
            }
        };
        
        try {
            console.log("Making API requests...");
            
            // Make both API calls at the same time for better performance
            const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                fetch(movieDetailsEndpoint, requestOptions),
                fetch(movieCreditsEndpoint, requestOptions)
            ]);
            
            console.log("API responses received, parsing JSON...");
            
            // Convert responses to JSON format
            const movieDetailsData = await movieDetailsResponse.json();
            const movieCreditsData = await movieCreditsResponse.json();
            
            console.log("Data parsed successfully, updating page...");
            
            // Update the webpage with the fetched data
            updatePageWithMovieData(movieDetailsData, movieCreditsData);
            
        } catch (error) {
            // Handle any errors that occur during the API calls
            console.error('Error loading movie data:', error);
            alert('Sorry, there was a problem loading the movie data. Please try again later.');
        }
    }();

    /*  PAGE UPDATE FUNCTIONS  */
    // This function takes the API data and updates the HTML elements
    function updatePageWithMovieData(movieDetails, creditsData) {
        console.log("Updating page with movie data...");
        
        /*  Update Movie Poster  */
        const posterElement = document.getElementById('individualPoster');
        if (posterElement) {
            // Build the full image URL from TMDB's partial path
            const fullPosterUrl = movieDetails.poster_path 
                ? IMAGE_BASE_URL + movieDetails.poster_path 
                : '../../assets/images/default-poster.jpg';
            posterElement.src = fullPosterUrl;
            console.log("Poster image updated");
        }
        
        /*  Update Movie Title */
        const titleElement = document.getElementById('individualTitle');
        if (titleElement) {
            titleElement.textContent = movieDetails.original_title || 'Title not available';
            console.log("Movie title updated: " + titleElement.textContent);
        }
        
        /*  Update Rating  */
        const ratingElement = document.getElementById('rating');
        if (ratingElement) {
            const movieRating = movieDetails.vote_average || 0;
            ratingElement.innerHTML = 
                `<img src="../../assets/icons/starIcon.png" style="height:15px"> ${movieRating.toFixed(1)}`;
            console.log("Movie rating updated: " + movieRating);
        }
        
        /*  Update Release Year  */
        const yearElement = document.getElementById('year');
        if (yearElement) {
            const releaseYear = movieDetails.release_date ? movieDetails.release_date.slice(0, 4) : 'N/A';
            yearElement.textContent = releaseYear;
            console.log("Release year updated: " + releaseYear);
        }
        
        /*  Update Genre  */
        const genreElement = document.getElementById('genre');
        if (genreElement) {
            const primaryGenre = movieDetails.genres && movieDetails.genres[0] 
                ? movieDetails.genres[0].name 
                : 'Genre not available';
            genreElement.textContent = primaryGenre;
            console.log("Movie genre updated: " + primaryGenre);
        }
        
        /* Update Description  */
        const descriptionElement = document.getElementById('movieDesc');
        if (descriptionElement) {
            descriptionElement.textContent = movieDetails.overview || 'No description available.';
            console.log("Movie description updated");
        }
        
        /*  Update Cast Information  */
        console.log("Updating cast information...");
        const castMembers = creditsData.cast || [];
        const topCastNames = castMembers.slice(0, 4).map(actor => actor.name);
        
        // Get all the actor elements on the page
        const actorElements = document.querySelectorAll('.movie-actors p.actor');
        
        // Update each actor element with cast member names
        actorElements.forEach(function(actorElement, index) {
            if (topCastNames[index]) {
                // Add comma after names except the last one
                const separator = index < 3 ? ',' : '';
                actorElement.textContent = topCastNames[index] + separator;
            }
        });
        
        console.log("All movie data successfully loaded and displayed!");
    }

    // Start the data loading process
    loadMovieData();
    
    console.log("Movie page initialization complete!");
});