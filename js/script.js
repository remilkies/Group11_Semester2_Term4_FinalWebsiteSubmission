    //BOOKMARK, WISHLIST, ICON HOVER + CLICK ACTIVE + TOGGLER
    const iconBookmarks = document.querySelectorAll(".watchlistIconFeature, .watchlistIcon");

    
    iconBookmarks.forEach((iconBookmark) => {
      let isActive = false;
    
    iconBookmark.addEventListener("mouseenter", () => {
      if (!isActive) {
        iconBookmark.src = iconBookmark.dataset.hover;
      }
    });

    iconBookmark.addEventListener("mouseleave", () => {
      if (!isActive) {
        iconBookmark.src = iconBookmark.dataset.default;
      }
    });

    // toggle - makes the bookmark stay pink
    iconBookmark.addEventListener("click", () => {
      isActive = !isActive;
      iconBookmark.src = isActive ? iconBookmark.dataset.active : iconBookmark.dataset.default;
    });
    });

    
    // this is for the watch button toggled to watchedButton
    const watchButton = document.querySelectorAll(".watchButton");

    watchButton.forEach((watchButton) => {
        let isActive = false;

        watchButton.addEventListener("click", () => {
            isActive = !isActive;
            watchButton.src = isActive ? watchButton.dataset.active : watchButton.dataset.default;
        });
    });

//make card extend
   
        $(".movieCard").on("mouseenter", function() {
          const card = $(this);
          const info = $(".movieInfo");
      
          // Bring above others
          card.animate({width: '600px'}, 500);
          info.animate({})
          
          card.css("z-index", 10);
          card.css("scale", 1.15);
        });
      
        $(".movieCard").on("mouseleave", function() {
          const card = $(this);

          card.animate({width: '222px'}, 100);
          card.css("scale", 1);
          // after animation
          setTimeout(() => {
            card.css("z-index", 1);
          }, 100);
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
    
    //API request

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