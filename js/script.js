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

//Homepage
class NewMovies {
  constructor(movieID, title, poster, director, rating){
        this.movieID = movieID;
        this.title = title;
        this.poster = poster;
        this.director = director;
        this.rating = rating;
    }
}

!async function(){
    const BASE_URL = 'https://api.themoviedb.org/3';
    
    // Initial movie list URL
    const initialURL = `${BASE_URL}/movie/now_playing?language=en-US&page=1`;
    
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2OWM4YWRiNmE3NGIyZDViNTA1MmE3ZjBlMTA0NDA1ZiIsIm5iZiI6MTc1ODI5Mjg1NS43NzEwMDAxLCJzdWIiOiI2OGNkNmI3NzI1NjVlMzcxOTMxNDk2NDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.AoEE9Ow4n3Zun2dAOqNR-kWFa3MW5RQ3DWYzRGSuZOc'
        }
    };

    let data = await fetch(initialURL, options)
        .then((response) => response.json())
        .catch((error) => { console.error("Error fetching movie list:", error); return null; });

    if (!data || !data.results) {
        console.error("Movie list data is invalid or missing 'results'.");
        return;
    }

    //may affect styling
    // needed to display the image
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

    let movieList = [];

    for (let i = 0; i < data.results.length; i++){
        let movie = data.results[i];

        let movieID = movie.id;
        let title = movie.title;
        let poster = movie.poster_path;
        let rating = movie.vote_average.toFixed(1);

        const creditsURL = `${BASE_URL}/movie/${movieID}/credits`;
        
        // Fetches the credits for the movie
        let creditsResponse = await fetch(creditsURL, options);
        let creditsData = await creditsResponse.json().catch(error => console.error(`Error fetching credits for ${title}:`, error));
        
        let director = 'N/A';
        
        // Finds the director
        if (creditsData && creditsData.crew) {
            const directorObject = creditsData.crew.find(member => member.job === 'Director');
            if (directorObject) {
                director = directorObject.name;
            }
        }

        movieList.push(window["movie_" + i] = new NewMovies(movieID, title, poster, director, rating));
    }

    console.log(movieList);

        // Image slider titles
        document.getElementById("titleFeature1").innerHTML = movieList[12].title;
        document.getElementById("titleFeature2").innerHTML = movieList[6].title;
        document.getElementById("titleFeature3").innerHTML = movieList[2].title;
        document.getElementById("titleFeature4").innerHTML = movieList[3].title;

        // Image slider ratings
        document.getElementById("featureRating1").innerHTML = movieList[12].rating;
        document.getElementById("featureRating2").innerHTML = movieList[6].rating;
        document.getElementById("featureRating3").innerHTML = movieList[2].rating;
        document.getElementById("featureRating4").innerHTML = movieList[3].rating;

        // Image slider posters
        document.getElementById("imageFeature1").src = IMAGE_BASE_URL + movieList[12].poster;
        document.getElementById("imageFeature2").src = IMAGE_BASE_URL + movieList[6].poster;
        document.getElementById("imageFeature3").src = IMAGE_BASE_URL + movieList[2].poster;
        document.getElementById("imageFeature4").src = IMAGE_BASE_URL + movieList[3].poster;

        // Image slider directors
        document.getElementById("directorFeature1").innerHTML = movieList[12].director; 
        document.getElementById("directorFeature2").innerHTML = movieList[6].director;
        document.getElementById("directorFeature3").innerHTML = movieList[2].director;
        document.getElementById("directorFeature4").innerHTML = movieList[3].director;
}();

class PopularMovies {
  constructor(title, poster, overview){
        this.title = title;
        this.poster = poster;
        this.overview = overview;
    }
}
    
    //API request

    !async function(){
const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
const options = {
	  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2OWM4YWRiNmE3NGIyZDViNTA1MmE3ZjBlMTA0NDA1ZiIsIm5iZiI6MTc1ODI5Mjg1NS43NzEwMDAxLCJzdWIiOiI2OGNkNmI3NzI1NjVlMzcxOTMxNDk2NDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.AoEE9Ow4n3Zun2dAOqNR-kWFa3MW5RQ3DWYzRGSuZOc'
  }
};

let data = await fetch(url, options)
        .then((response)=> response.json())
        .then((result)=> {return result})
        .catch((error)=> console.log(error));

    //may affect styling
    // needed to display the image: gives the API necessary information
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

        let popMovies = [];

        for (i = 0; i < data.results.length; i++){

        let title = data.results[i].title;
        let poster = data.results[i].poster_path;
        //OGoverview gets the overview and overview makes it shorter so that if it doesn't fit the content gets cut.
        let OGoverview = data.results[i].overview;
        let overview = OGoverview.length > 200 ? OGoverview.substring(0, 200) + ' ...' : OGoverview;

        popMovies.push(window["movie_" + i] = new PopularMovies(title, poster, overview));
    }

    console.log(popMovies);

    //popular movies titles
    document.getElementById('titlePopular1').innerHTML = popMovies[0].title;
    document.getElementById('titlePopular2').innerHTML = popMovies[1].title;
    document.getElementById('titlePopular3').innerHTML = popMovies[17].title;
    document.getElementById('titlePopular4').innerHTML = popMovies[3].title;
    document.getElementById('titlePopular5').innerHTML = popMovies[18].title;

    //popular movies descriptions
    document.getElementById('Overview1').innerHTML = popMovies[0].overview;
    document.getElementById('Overview2').innerHTML = popMovies[1].overview;
    document.getElementById('Overview3').innerHTML = popMovies[17].overview;
    document.getElementById('Overview4').innerHTML = popMovies[3].overview;
    document.getElementById('Overview5').innerHTML = popMovies[18].overview;

    //popular movies posters
    document.getElementById("imagePopular1").src = IMAGE_BASE_URL + popMovies[0].poster;
    document.getElementById("imagePopular2").src = IMAGE_BASE_URL + popMovies[1].poster;
    document.getElementById("imagePopular3").src = IMAGE_BASE_URL + popMovies[17].poster;
    document.getElementById("imagePopular4").src = IMAGE_BASE_URL + popMovies[3].poster;
    document.getElementById("imagePopular5").src = IMAGE_BASE_URL + popMovies[18].poster;
    
}();

//Top Rated Movies
class TopMovies {
  constructor(title, poster, overview){
        this.title = title;
        this.poster = poster;
        this.overview = overview;
    }
}
    
    //API request

    !async function(){
const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200';
const options = {
	  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2OWM4YWRiNmE3NGIyZDViNTA1MmE3ZjBlMTA0NDA1ZiIsIm5iZiI6MTc1ODI5Mjg1NS43NzEwMDAxLCJzdWIiOiI2OGNkNmI3NzI1NjVlMzcxOTMxNDk2NDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.AoEE9Ow4n3Zun2dAOqNR-kWFa3MW5RQ3DWYzRGSuZOc'
  }
};

let data = await fetch(url, options)
        .then((response)=> response.json())
        .then((result)=> {return result})
        .catch((error)=> console.log(error));

    //may affect styling
    // needed to display the image: gives the API necessary information
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

        let topMovies = [];

        for (i = 0; i < data.results.length; i++){

        let title = data.results[i].title;
        let poster = data.results[i].poster_path;
        let OGoverview = data.results[i].overview;
        let overview = OGoverview.length > 200 ? OGoverview.substring(0, 200) + ' ...' : OGoverview;

        topMovies.push(window["movie_" + i] = new TopMovies(title, poster, overview));
    }

    console.log(topMovies);

    //Top Rated movies titles
    document.getElementById('titleTop1').innerHTML = topMovies[0].title;
    document.getElementById('titleTop2').innerHTML = topMovies[1].title;
    document.getElementById('titleTop3').innerHTML = topMovies[17].title;
    document.getElementById('titleTop4').innerHTML = topMovies[3].title;
    document.getElementById('titleTop5').innerHTML = topMovies[18].title;

    //Top Rated movies descriptions
    document.getElementById('OverviewTop1').innerHTML = topMovies[0].overview;
    document.getElementById('OverviewTop2').innerHTML = topMovies[1].overview;
    document.getElementById('OverviewTop3').innerHTML = topMovies[17].overview;
    document.getElementById('OverviewTop4').innerHTML = topMovies[3].overview;
    document.getElementById('OverviewTop5').innerHTML = topMovies[18].overview;

    //Top Rated movies posters
    document.getElementById("imageTop1").src = IMAGE_BASE_URL + topMovies[0].poster;
    document.getElementById("imageTop2").src = IMAGE_BASE_URL + topMovies[1].poster;
    document.getElementById("imageTop3").src = IMAGE_BASE_URL + topMovies[17].poster;
    document.getElementById("imageTop4").src = IMAGE_BASE_URL + topMovies[3].poster;
    document.getElementById("imageTop5").src = IMAGE_BASE_URL + topMovies[18].poster;

    //need to display the information on the website
    
}();
