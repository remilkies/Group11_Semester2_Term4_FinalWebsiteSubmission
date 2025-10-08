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
  constructor(newMovies, title, poster, director, rating){
        this.newMovies = newMovies;
        this.title = title;
        this.poster = poster;
        this.director = director;
        this.rating = rating;
    }
}
    
    //API request

    !async function(){
const url = 'https://youtube138.p.rapidapi.com/auto-complete/?q=desp&hl=en&gl=US';
const options = {
	  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2OWM4YWRiNmE3NGIyZDViNTA1MmE3ZjBlMTA0NDA1ZiIsIm5iZiI6MTc1ODI5Mjg1NS43NzEwMDAxLCJzdWIiOiI2OGNkNmI3NzI1NjVlMzcxOTMxNDk2NDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.AoEE9Ow4n3Zun2dAOqNR-kWFa3MW5RQ3DWYzRGSuZOc'
  }
};

let data = await fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options)
        .then((response)=> response.json())
        .then((result)=> {return result})
        .catch((error)=> console.log(error));


        let movieList = [];

        for (i = 0; i < data.results.length; i++){

        let newMovies = data.results[i].now_playing;
        let title = data.results[i].title;
        let poster = data.results[i].poster_path;
        let director = data.results[i].known_for_department;
        let rating = data.results[i].vote_average;

        movieList.push(window["movie_" + i] = new NewMovies(newMovies, title, poster,director, rating));
    }

    console.log(movieList);

    document.getElementById("titleFeature1").innerHTML = movieList[0].title;
    document.getElementById("titleFeature2").innerHTML = movieList[1].title;
    document.getElementById("titleFeature3").innerHTML = movieList[2].title;
    document.getElementById("titleFeature4").innerHTML = movieList[3].title;
    
    document.getElementById("imageFeature1").innerHTML = movieList[0].poster;
    document.getElementById("imageFeature2").innerHTML = movieList[1].poster;
    document.getElementById("imageFeature3").innerHTML = movieList[2].poster;
    document.getElementById("imageFeature4").innerHTML = movieList[3].poster;

}();


// Notes:
// Get the right information for the director
//Show the information in the on the website
//For the next part, to show the most popular movies do I use a new async function?

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


        let popMovies = [];

        for (i = 0; i < data.results.length; i++){

        let title = data.results[i].title;
        let poster = data.results[i].poster_path;
        let overview = data.results[i].overview;

        popMovies.push(window["movie_" + i] = new PopularMovies(title, poster, overview));
    }

    console.log(popMovies);

    //need to display the information on the website
    
}();

//     //get new released movies
// }();