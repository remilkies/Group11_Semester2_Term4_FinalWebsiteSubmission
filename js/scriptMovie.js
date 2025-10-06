class Movies{
    constructor(poster, title, rating, year, genre, description, actors){
        this.poster = poster;
        this.title = title;
        this.rating = rating;
        this.year = year;
        this.genre = genre;
        this.description = description;
        this.actors = actors;
    }
}



// for (i = 0; i < data.movies.length; i++){

//     let image = data.movies[i].image;
//     let title = data.movies[i].title;
//     let year = data.movies[i].year;
//     let duration = data.movies[i].timeline;
//     let rating = data.movies[i].imdbRating;
//     let link = data.movies[i].link;

//     movieList.push(window["movie_" + i] = new Movies(image, year, title, duration, rating, link)); //names object as movie_0, then movie_1, then movie_2 ect.
// }

!async function () {
    
    const url = 'https://api.themoviedb.org/3/movie/617126?language=en-US';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZDE2OWZkMTg5MDg0NGZkNGZiMGMzYmI5YWIzOTkzMCIsIm5iZiI6MTc1OTQwNzA5MC41NDcwMDAyLCJzdWIiOiI2OGRlNmJmMjJkMGI0YTkwYjZkYTU3OWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.H3q6GBug0aWNLQPpsTml0iQE9AAWo8QJzI2GBSxWuP4'
      }
    };
    
    let data = await fetch(url, options)
      .then(res => res.json())
      .then(json => { // Modified this line
        console.log(json);
        return json; // Added this line to return the parsed JSON
      })
      .catch(err => console.error(err));

      console.log(data);

      console.log(data.genres[0])

      let poster = data.poster_path || "poster error";
      let title = data.original_title || "title error";
      let rating = data.vote_average || "rating error";
      let year = data.release_date || "year error";
      let genre = data.genres[0] || "genre error";
      let genreName = genre.name;
      let description = data.overview || "desc error";

    let individualMovie = new Movies(poster, title, rating, year, genre, description)

    console.log(individualMovie);
    
    document.getElementById('individualTitle').innerHTML = individualMovie.title;

    document.getElementById('individualPoster').src = individualMovie.poster;

    document.getElementById('genre').innerHTML = genreName;

    document.getElementById('rating').innerHTML = 
    `<img src="../../assets/icons/starIcon.png" style="height: 15px"> ` + rating;
    document.getElementById('movieDesc').innerHTML = description;
}();

!async function () {

    const url = 'https://api.themoviedb.org/3/movie/617126/credits?language=en-US';
    const options = {
    method: 'GET',
    headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZDE2OWZkMTg5MDg0NGZkNGZiMGMzYmI5YWIzOTkzMCIsIm5iZiI6MTc1OTQwNzA5MC41NDcwMDAyLCJzdWIiOiI2OGRlNmJmMjJkMGI0YTkwYjZkYTU3OWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.H3q6GBug0aWNLQPpsTml0iQE9AAWo8QJzI2GBSxWuP4'
  }
};

let data = await fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));
    
    
}()