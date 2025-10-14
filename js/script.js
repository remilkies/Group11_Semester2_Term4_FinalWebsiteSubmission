/* Dream Stream - DEBUG VERSION */
console.log('🏠 SCRIPT REACHES CARDS:', document.querySelectorAll('.movieCard').length);

document.addEventListener('DOMContentLoaded', function() {
    console.log("=== DOM CONTENT LOADED ===");
    console.log('🏠 CARDS AFTER DOM LOAD:', document.querySelectorAll('.movieCard').length);

    const API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZDE2OWZkMTg5MDg0NGZkNGZiMGMzYmI5YWIzOTkzMCIsIm5iZiI6MTc1OTQwNzA5MC41NDcwMDAyLCJzdWIiOiI2OGRlNmJmMjJkMGI0YTkwYjZkYTU3OWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.H3q6GBug0aWNLQPpsTml0iQE9AAWo8QJzI2GBSxWuP4';
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

    //  MOVIE LIBRARY PAGE 
    function initializeMovieLibraryPage() {
        if (!window.location.pathname.includes('movie-library.html')) return;
        
        console.log("Library page initialised");
        fixLibraryImagePaths();
        fetchLibraryMovies();
    }

    function fixLibraryImagePaths() {
        console.log("🖼️ Fixing image paths...");
        document.querySelectorAll('.watchlistIcon').forEach(icon => {
            icon.src = '../assets/icons/watchlistIcon.png';
        });
        document.querySelectorAll('.moviePoster img').forEach(img => {
            if (img.src.includes('insert')) {
                img.src = '../assets/images/default-poster.jpg';
            }
        });
    }

    async function fetchLibraryMovies() {
    console.log("Fetching movies from API...");
    
    // : Using mock data since API token is not working on my side ( might be "CORS/ Cross-Origin Resource Sharing" according to google and AI)
    console.log(" API token not working - using mock data");
    useMockMovieData();
    
    // commented until further notice
    /*
    try {
        const response = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'accept': 'application/json'
            }
        });
        
        console.log(' API Response status:', response.status);
        
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        
        const data = await response.json();
        console.log(' Popular list arrived with', data.results.length, 'movies');
        
        fillCards(data.results.slice(0, 25));
        
    } catch (err) {
        console.warn(' Fetch failed', err);
        useMockMovieData();
    }
    */
}

function useMockMovieData() {
    console.log("🎬 Using mock movie data");
    
    const mockMovies = [
        { id: 617126, title: "Wish", overview: "A young girl saves her kingdom by making a wish.", poster_path: "/z1KkmFu53fMUX9aJ8FOGDHl41u.jpg" },
        { id: 787699, title: "Wonka", overview: "The story of how Willy Wonka became the famous chocolatier.", poster_path: "/qhb1qOilapbapxWQn9jtRCMwXJF.jpg" },
        { id: 565770, title: "Blue Beetle", overview: "A teenager gains superpowers from an alien scarab.", poster_path: "/mXLOHHc1Zeuwsl4xYKjKh2280oL.jpg" },
        { id: 872585, title: "Oppenheimer", overview: "The story of American scientist J. Robert Oppenheimer.", poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg" },
        { id: 976573, title: "Elemental", overview: "In a city where fire, water, land and air residents live together.", poster_path: "/4Y1WNkd88JXmGfhtWR7dmDAo1T2.jpg" },
        { id: 447365, title: "Guardians of the Galaxy 3", overview: "The Guardians embark on one last mission.", poster_path: "/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg" },
        { id: 667538, title: "Transformers: Rise", overview: "Optimus Prime and the Autobots take on their biggest challenge.", poster_path: "/gPbM0MK8CP8A174rmUwGsADNYKD.jpg" },
        { id: 298618, title: "The Flash", overview: "Barry Allen uses his super speed to change the past.", poster_path: "/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg" },
        { id: 502356, title: "Super Mario Bros", overview: "Mario and Luigi embark on an adventure in the Mushroom Kingdom.", poster_path: "/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg" },
        { id: 569094, title: "Spider-Man: Across", overview: "Miles Morales catapults across the Multiverse.", poster_path: "/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg" }
    ];
    
    // Fill all 25+ cards by repeating the mock movies
    const allMovies = [];
    for (let i = 0; i < 25; i++) {
        allMovies.push(mockMovies[i % mockMovies.length]);
    }
    
    fillCards(allMovies);
}

    function fillCards(movies) {
        console.log('🎬 fillCards called with', movies.length, 'movies');
        
        document.querySelectorAll('.movieCard').forEach((card, i) => {
            console.log('🔍 Working on card index', i);
            
            if (movies[i]) {
                const movie = movies[i];
                
                // Testing: trying dummy image 
                const posterImg = card.querySelector('.moviePoster img');
                if (posterImg) {
                    posterImg.src = movie.poster_path
  ? IMAGE_BASE_URL + movie.poster_path
  : '../assets/images/movieKaz.jpg';
                    console.log('✅ Dummy poster injected into card', i);
                }
                
                // Test: I need to try updating title
                const title = card.querySelector('.movie-title h3');
                if (title) {
                    title.textContent = 'TEST ' + (i+1) + ': ' + movie.title;
                    console.log('✅ Title updated for card', i);
                }
                
                // Update link
                const link = card.querySelector('.movie-title');
                if (link) {
                    link.href = `individualMovie/movie-template.html?movieId=${movie.id}`;
                }
            }
        });
    }

    // Universal Functions 
    function setupIconInteractions() {
        document.querySelectorAll(".watchlistIconFeature, .watchlistIcon, .watchButton").forEach((icon) => {
            let isActive = false;
            icon.addEventListener("mouseenter", () => { if (!isActive && icon.dataset.hover) icon.src = icon.dataset.hover; });
            icon.addEventListener("mouseleave", () => { if (!isActive && icon.dataset.default) icon.src = icon.dataset.default; });
            icon.addEventListener("click", () => {
                isActive = !isActive;
                icon.src = isActive ? icon.dataset.active : icon.dataset.default;
            });
        });
    }

    function setupCardAnimations() {
        $(".movieCard").on("mouseenter", function() {
            $(this).animate({width: '600px'}, 500).css({"z-index": 10, "scale": 1.15});
        }).on("mouseleave", function() {
            const card = $(this);
            card.animate({width: '222px'}, 100).css("scale", 1);
            setTimeout(() => card.css("z-index", 1), 100);
        });
    }

    //  INDIVIDUAL MOVIE PAGE 
    function initializeIndividualMoviePage() {
        if (!document.getElementById('individualPoster')) return;
        console.log("🎬 Individual movie page initialized");
        // need to readd individual movie page code here
    }

    // Initialize Stage 
    console.log(" Starting initialization...");
    
    setupIconInteractions();
    setupCardAnimations();
    initializeIndividualMoviePage();
    initializeMovieLibraryPage();
    
    console.log("Initialization complete!");
});

document.querySelectorAll('.watchlistIcon').forEach(icon => {
  icon.src = '../assets/icons/watchlistIcon.png';
  icon.dataset.default = '../assets/icons/watchlistIcon.png';
  icon.dataset.hover   = '../assets/icons/watchlistAdded.png';
  icon.dataset.active  = '../assets/icons/watchlistAdded.png';
});