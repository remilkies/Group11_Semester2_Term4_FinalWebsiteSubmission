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