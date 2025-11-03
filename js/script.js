//  MOVIE LIBRARY PAGE - 
window.API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2OWM4YWRiNmE3NGIyZDViNTA1MmE3ZjBlMTA0NDA1ZiIsIm5iZiI6MTc1ODI5Mjg1NS43NzEwMDAxLCJzdWIiOiI2OGNkNmI3NzI1NjVlMzcxOTMxNDk2NDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.AoEE9Ow4n3Zun2dAOqNR-kWFa3MW5RQ3DWYzRGSuZOc';
const IMG = "https://image.tmdb.org/t/p/w500";

// Wait for DOM to be ready before running
document.addEventListener('DOMContentLoaded', async function() {
    
    // BETTER PAGE DETECTION - Check URL instead of just elements
    const currentPath = window.location.pathname;
    const isLibraryPage = currentPath.includes('movie-library.html');
    const isIndividualPage = currentPath.includes('movie-template.html');
    const isHomepage = currentPath.includes('index.html') || currentPath === '/' || currentPath.endsWith('/');
    
    console.log('Page Detection:', { currentPath, isHomepage, isLibraryPage, isIndividualPage });
    
    // Setup universal navbar search on ALL pages
    setupUniversalSearch();
    
    // Setup universal navbar genre dropdown on ALL pages
    setupUniversalGenreDropdown();
    
    // Only run library code on library page
    if (isLibraryPage && document.querySelector('.movieCard')) {
        console.log("Loading movie library...");
        
        // Check if there's a search query in URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        const genreId = urlParams.get('genre');
        const genreName = urlParams.get('genreName');
        
        if (searchQuery) {
            console.log("Search query detected:", searchQuery);
            await searchMovies(searchQuery);
        } else if (genreId && genreName) {
            console.log("Genre parameter detected:", genreName);
            await loadAllSectionsWithGenre(parseInt(genreId), genreName);
        } else {
            await loadMovieLibrary();
        }
        
        setupSearch(); // Add library page search functionality
    }
    
    // Only run individual movie code on individual page
    if (isIndividualPage) {
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get('movieId');
        
        if (movieId) {
            console.log("Loading individual movie...");
            await loadIndividualMovie(movieId);
        } else {
            console.warn("No movieId in URL. Cannot load movie details.");
        }
    }
    
    // Setup interactions on all pages
    setupInteractions();
});

// MOVIE LIBRARY LOADING
async function loadMovieLibrary() {
    // Reset section titles to original
    document.querySelectorAll('.movieContainer h2').forEach(title => {
        if (title.dataset.originalText) {
            title.textContent = title.dataset.originalText;
        }
    });
    
    // Show all sections
    document.querySelectorAll('.movieContainer').forEach(section => {
        section.style.display = '';
    });
    
    // Show all cards
    document.querySelectorAll('.movieCard').forEach(card => {
        card.style.display = '';
        if (card.parentElement) {
            card.parentElement.style.display = '';
        }
    });
    
    // Load different genres for each section
    const sections = [
        { container: '.movieContainer:nth-of-type(1)', genre: 10749, name: 'Romance' },
        { container: '.movieContainer:nth-of-type(2)', genre: 28, name: 'Action' },
        { container: '.movieContainer:nth-of-type(3)', genre: 27, name: 'Horror' }
    ];

    for (const section of sections) {
        await loadSection(section.container, section.genre, section.name);
    }
}

// Load movies for a specific section
async function loadSection(containerSelector, genreId, genreName) {
    const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US&page=1&sort_by=popularity.desc`;
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
        
        console.log(`${genreName} Movies:`, data);

        if (data.results && data.results.length > 0) {
            const container = document.querySelector(containerSelector);
            const cards = container.querySelectorAll('.movieCard');
            
            cards.forEach((card, index) => {
                if (data.results[index]) {
                    const movie = data.results[index];
                    updateMovieCard(card, movie, index);
                }
            });
            
            console.log(`${genreName} section loaded successfully!`);
        }
    } catch (error) {
        console.error(`Error loading ${genreName} section:`, error);
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
    
    if (!movieId) {
        console.error("No movie ID provided!");
        return;
    }
    
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
        console.log("Fetching movie details from:", movieUrl);
        
        const movieResponse = await fetch(movieUrl, options);
        const movieData = await movieResponse.json();
        
        console.log("Movie Data:", movieData);

        // Load movie credits
        const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`;
        console.log("Fetching credits from:", creditsUrl);
        
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
                console.log("Poster updated");
            } else {
                console.warn("Poster element #individualPoster not found");
            }
            
            // Update title
            const titleElement = document.getElementById('individualTitle');
            if (titleElement) {
                titleElement.textContent = movieData.title || 'Title unavailable';
                console.log("Title updated:", movieData.title);
            } else {
                console.warn("Title element #individualTitle not found");
            }
            
            // Update rating
            const ratingElement = document.getElementById('rating');
            if (ratingElement) {
                const rating = movieData.vote_average ? movieData.vote_average.toFixed(1) : 'N/A';
                ratingElement.innerHTML = `<img src="../../assets/icons/starIcon.png" style="height:15px" alt="Star"> ${rating}`;
                console.log("Rating updated:", rating);
            } else {
                console.warn("Rating element #rating not found");
            }
            
            // Update year
            const yearElement = document.getElementById('year');
            if (yearElement) {
                yearElement.textContent = movieData.release_date ? movieData.release_date.slice(0, 4) : 'N/A';
                console.log("Year updated");
            } else {
                console.warn("Year element #year not found");
            }
            
            // Update genre
            const genreElement = document.getElementById('genre');
            if (genreElement) {
                genreElement.textContent = movieData.genres && movieData.genres[0] ? movieData.genres[0].name : 'Genre N/A';
                console.log("Genre updated");
            } else {
                console.warn("Genre element #genre not found");
            }
            
            // Update description
            const descElement = document.getElementById('movieDesc');
            if (descElement) {
                descElement.textContent = movieData.overview || 'No description available.';
                console.log("Description updated");
            } else {
                console.warn("Description element #movieDesc not found");
            }
        }

        // Update actors AND director
        if (creditsData) {
            // Find and display director(s)
            if (creditsData.crew) {
                const directors = creditsData.crew.filter(member => member.job === 'Director');
                const directorElements = document.querySelectorAll('.movie-directors p.director');
                
                if (directorElements.length > 0 && directors.length > 0) {
                    directorElements.forEach((element, index) => {
                        if (directors[index]) {
                            element.textContent = directors[index].name + (index < directors.length - 1 ? ',' : '');
                        } else {
                            element.textContent = '';
                        }
                    });
                    console.log("Directors updated:", directors.map(d => d.name).join(', '));
                } else if (directors.length > 0) {
                    console.warn("Director elements not found. Directors are:", directors.map(d => d.name).join(', '));
                } else {
                    console.warn("No directors found in credits data");
                }
            }
            
            // Update actors
            if (creditsData.cast) {
                const actorElements = document.querySelectorAll('.movie-actors p.actor');
                const actors = creditsData.cast.slice(0, Math.min(5, creditsData.cast.length));
                
                if (actorElements.length > 0) {
                    actorElements.forEach((element, index) => {
                        if (actors[index]) {
                            element.textContent = actors[index].name + (index < actors.length - 1 ? ',' : '');
                        } else {
                            element.textContent = '';
                        }
                    });
                    console.log("Actors updated:", actors.map(a => a.name).join(', '));
                } else {
                    console.warn("No actor elements found");
                    console.log("Top actors:", actors.slice(0, 5).map(a => a.name));
                }
            }
        }
        
        console.log("Individual movie page loaded successfully!");
        
    } catch (error) {
        console.error("Error loading individual movie:", error);
    }
}

// Universal genre dropdown for navbar (works on all pages)
function setupUniversalGenreDropdown() {
    // Find navbar genre dropdown menu
    const genreDropdownMenu = document.querySelector('.nav-item.dropdown .dropdown-menu');
    
    if (!genreDropdownMenu) {
        console.warn("Navbar genre dropdown not found");
        return;
    }
    
    // Clear existing items
    genreDropdownMenu.innerHTML = '';
    
    // Genre options with their TMDB IDs
    const genres = [
        { name: 'Action', id: 28 },
        { name: 'Comedy', id: 35 },
        { name: 'Horror', id: 27 },
        { name: 'Romance', id: 10749 },
        { name: 'Sci-Fi', id: 878 },
        { name: 'Thriller', id: 53 },
        { name: 'Animation', id: 16 },
        { name: 'Drama', id: 18 }
    ];
    
    genres.forEach(genre => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        
        const link = document.createElement('a');
        link.className = 'nav-link';
        link.href = '#';
        link.style.cursor = 'pointer';
        link.innerHTML = `
            <img src="assets/icons/starIconActive.png" class="nav-icon" style="height: 23px;">
            <h2>${genre.name}</h2>
        `;
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const currentPath = window.location.pathname;
            
            if (currentPath.includes('movie-library.html')) {
                // Already on library, just load genre
                loadAllSectionsWithGenre(genre.id, genre.name);
            } else {
                // Redirect to library with genre parameter
                let targetPath = '';
                if (currentPath.includes('individualMovie')) {
                    targetPath = `../movie-library.html?genre=${genre.id}&genreName=${encodeURIComponent(genre.name)}`;
                } else if (currentPath.includes('pages/')) {
                    targetPath = `movie-library.html?genre=${genre.id}&genreName=${encodeURIComponent(genre.name)}`;
                } else {
                    targetPath = `pages/movie-library.html?genre=${genre.id}&genreName=${encodeURIComponent(genre.name)}`;
                }
                window.location.href = targetPath;
            }
        });
        
        li.appendChild(link);
        genreDropdownMenu.appendChild(li);
    });
    
    console.log('Universal navbar genre dropdown activated');
}

// Check for genre parameter in URL on library page load
async function checkGenreParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    const genreId = urlParams.get('genre');
    const genreName = urlParams.get('genreName');
    
    if (genreId && genreName) {
        console.log('Genre parameter detected:', genreName);
        await loadAllSectionsWithGenre(parseInt(genreId), genreName);
    }
}
function setupSearch() {
    const searchInput = document.querySelector('.movie-searchBar input[type="search"]');
    
    if (!searchInput) {
        console.warn("Search bar not found");
        return;
    }
    
    console.log("Library search bar ready");
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.trim();
        
        clearTimeout(searchTimeout);
        
        if (query === '') {
            loadMovieLibrary();
            // Clear URL parameter
            window.history.pushState({}, '', window.location.pathname);
            return;
        }
        
        searchTimeout = setTimeout(() => {
            // Update URL with search query
            const newUrl = `${window.location.pathname}?search=${encodeURIComponent(query)}`;
            window.history.pushState({}, '', newUrl);
            searchMovies(query);
        }, 500);
    });
    
    // Populate search bar if query in URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
        searchInput.value = searchQuery;
    }
}

// Universal search for navbar (works on all pages)
function setupUniversalSearch() {
    const navbarSearchInputs = document.querySelectorAll('.navbar-searchBar input[type="search"]');
    
    navbarSearchInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = this.value.trim();
                
                if (query) {
                    const currentPath = window.location.pathname;
                    
                    if (currentPath.includes('movie-library.html')) {
                        searchMovies(query);
                    } else if (currentPath.includes('individualMovie')) {
    // Go up one folder to reach /pages/movie-library.html
    window.location.href = `../movie-library.html?search=${encodeURIComponent(query)}`;
} 
else if (currentPath.includes('pages/')) {
    // Already in /pages, go directly to movie-library.html
    window.location.href = `movie-library.html?search=${encodeURIComponent(query)}`;
} 
else {
    // From homepage or root
    window.location.href = `pages/movie-library.html?search=${encodeURIComponent(query)}`;
}
                }
            }
        });
    });
    
    console.log(`${navbarSearchInputs.length} navbar search bars activated`);
}

// Search for movies by title (Genre-agnostic, smart collapsing)
async function searchMovies(query) {
    console.log("Searching for:", query);
    
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1`;
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
        
        console.log("Search results:", data);

        if (data.results && data.results.length > 0) {
            const sections = document.querySelectorAll('.movieContainer');
            let firstVisibleSection = true;
            
            sections.forEach((section, sectionIndex) => {
                const cards = section.querySelectorAll('.movieCard');
                const startIndex = sectionIndex * 10;
                let visibleCount = 0;
                
                cards.forEach((card, cardIndex) => {
                    const movieIndex = startIndex + cardIndex;
                    
                    if (data.results[movieIndex]) {
                        card.style.display = '';
                        if (card.parentElement) {
                            card.parentElement.style.display = '';
                        }
                        updateMovieCard(card, data.results[movieIndex], movieIndex);
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                        if (card.parentElement) {
                            card.parentElement.style.display = 'none';
                        }
                    }
                });
                
                // Hide/show entire section
                if (visibleCount === 0) {
                    section.style.display = 'none';
                } else {
                    section.style.display = '';
                    const sectionTitle = section.querySelector('h2');
                    if (sectionTitle && !sectionTitle.dataset.originalText) {
                        sectionTitle.dataset.originalText = sectionTitle.textContent;
                    }
                    
                    // Only show title on FIRST visible section
                    if (sectionTitle) {
                        if (firstVisibleSection) {
                            sectionTitle.textContent = `Search Results for "${query}" (${data.results.length} found)`;
                            sectionTitle.style.display = '';
                            firstVisibleSection = false;
                        } else {
                            sectionTitle.style.display = 'none'; // Hide duplicate titles
                        }
                    }
                }
            });
            
            console.log(`Displayed ${data.results.length} search results across sections`);
        } else {
            // No results - hide all sections
            const sections = document.querySelectorAll('.movieContainer');
            sections.forEach(section => {
                section.style.display = 'none';
            });
            console.log("No results found for:", query);
        }
    } catch (error) {
        console.error("Error searching movies:", error);
    }
}

// INTERACTIONS 
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
    
    // Setup filter buttons
    setupFilters();
}

// Setup filter/sort functionality
function setupFilters() {
    const filterBar = document.querySelector('.filter-bar');
    if (!filterBar) return;
    
    const sortOptions = filterBar.querySelectorAll('.p-2');
    
    sortOptions.forEach((option, index) => {
        if (index === 0) return; // Skip "Sort:" label
        
        option.style.cursor = 'pointer';
        option.style.position = 'relative';
        
        // Special handling for Genre filter
        if (option.textContent.trim() === 'Genre') {
            setupGenreDropdown(option);
            return;
        }
        
        option.addEventListener('click', async function() {
            console.log('Filter clicked:', this.textContent);
            
            sortOptions.forEach(opt => opt.style.fontWeight = 'normal');
            this.style.fontWeight = 'bold';
            
            // Clear search when filter is clicked
            const searchInput = document.querySelector('.movie-searchBar input[type="search"]');
            if (searchInput) {
                searchInput.value = '';
            }
            window.history.pushState({}, '', window.location.pathname);
            
            let sortBy = 'popularity.desc';
            
            switch(this.textContent.trim()) {
                case 'Trending':
                    sortBy = 'popularity.desc';
                    break;
                case 'Release Date':
                    sortBy = 'release_date.desc';
                    break;
                case 'Rating':
                    sortBy = 'vote_average.desc';
                    break;
            }
            
            await loadMovieLibraryWithSort(sortBy);
        });
    });
}

// Setup genre dropdown menu
function setupGenreDropdown(genreOption) {
    // Create dropdown menu
    const dropdown = document.createElement('div');
    dropdown.className = 'genre-dropdown';
    dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        background: #303030;
        border-radius: 10px;
        padding: 10px;
        display: none;
        z-index: 1000;
        min-width: 150px;
        margin-top: 5px;
    `;
    
    // Genre options with their TMDB IDs
    const genres = [
        { name: 'Action', id: 28 },
        { name: 'Comedy', id: 35 },
        { name: 'Horror', id: 27 },
        { name: 'Romance', id: 10749 },
        { name: 'Sci-Fi', id: 878 },
        { name: 'Thriller', id: 53 },
        { name: 'Animation', id: 16 },
        { name: 'Drama', id: 18 }
    ];
    
    genres.forEach(genre => {
        const genreItem = document.createElement('div');
        genreItem.textContent = genre.name;
        genreItem.style.cssText = `
            padding: 8px 12px;
            cursor: pointer;
            border-radius: 5px;
            color: #F2E0C7;
            transition: background 0.2s;
        `;
        
        genreItem.addEventListener('mouseenter', function() {
            this.style.background = '#d6a3ae';
        });
        
        genreItem.addEventListener('mouseleave', function() {
            this.style.background = 'transparent';
        });
        
        genreItem.addEventListener('click', async function(e) {
            e.stopPropagation();
            console.log('Genre selected:', genre.name);
            
            // Clear search
            const searchInput = document.querySelector('.movie-searchBar input[type="search"]');
            if (searchInput) {
                searchInput.value = '';
            }
            window.history.pushState({}, '', window.location.pathname);
            
            // Load all sections with selected genre
            await loadAllSectionsWithGenre(genre.id, genre.name);
            
            // Close dropdown
            dropdown.style.display = 'none';
        });
        
        dropdown.appendChild(genreItem);
    });
    
    genreOption.appendChild(dropdown);
    
    // Toggle dropdown on click
    genreOption.addEventListener('click', function(e) {
        e.stopPropagation();
        const isVisible = dropdown.style.display === 'block';
        dropdown.style.display = isVisible ? 'none' : 'block';
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        dropdown.style.display = 'none';
    });
    
    console.log('Genre dropdown activated');
}

// Load all sections with a specific genre
async function loadAllSectionsWithGenre(genreId, genreName) {
    console.log(`Loading all sections with genre: ${genreName}`);
    
    // Reset and show all sections
    document.querySelectorAll('.movieContainer').forEach(section => {
        section.style.display = '';
    });
    
    document.querySelectorAll('.movieCard').forEach(card => {
        card.style.display = '';
        if (card.parentElement) {
            card.parentElement.style.display = '';
        }
    });
    
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_TOKEN}`
        }
    };

    try {
        // Fetch page 1 and page 2 to get 40 movies total
        const page1Url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US&page=1&sort_by=popularity.desc`;
        const page2Url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US&page=2&sort_by=popularity.desc`;
        
        const [response1, response2] = await Promise.all([
            fetch(page1Url, options),
            fetch(page2Url, options)
        ]);
        
        const data1 = await response1.json();
        const data2 = await response2.json();
        
        // Combine results from both pages
        const allMovies = [...data1.results, ...data2.results];
        
        console.log(`${genreName} Movies:`, allMovies.length, 'total');

        if (allMovies.length > 0) {
            const sections = document.querySelectorAll('.movieContainer');
            
            sections.forEach((section, sectionIndex) => {
                const cards = section.querySelectorAll('.movieCard');
                const startIndex = sectionIndex * 10;
                
                // Update section title
                const sectionTitle = section.querySelector('h2');
                if (sectionTitle) {
                    if (!sectionTitle.dataset.originalText) {
                        sectionTitle.dataset.originalText = sectionTitle.textContent;
                    }
                    sectionTitle.textContent = `${genreName} Movies - Page ${sectionIndex + 1}`;
                }
                
                cards.forEach((card, cardIndex) => {
                    const movieIndex = startIndex + cardIndex;
                    if (allMovies[movieIndex]) {
                        updateMovieCard(card, allMovies[movieIndex], movieIndex);
                    }
                });
            });
            
            console.log(`Loaded ${allMovies.length} ${genreName} movies across all sections`);
        }
    } catch (error) {
        console.error(`Error loading ${genreName} movies:`, error);
    }
}

// Load movie library with custom sort
async function loadMovieLibraryWithSort(sortBy) {
    const sections = [
        { container: '.movieContainer:nth-of-type(1)', genre: 10749, name: 'Romance' },
        { container: '.movieContainer:nth-of-type(2)', genre: 28, name: 'Action' },
        { container: '.movieContainer:nth-of-type(3)', genre: 27, name: 'Horror' }
    ];

    for (const section of sections) {
        await loadSectionWithSort(section.container, section.genre, section.name, sortBy);
    }
}

// Load section with custom sort
async function loadSectionWithSort(containerSelector, genreId, genreName, sortBy) {
    const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US&page=1&sort_by=${sortBy}${sortBy === 'vote_average.desc' ? '&vote_count.gte=100' : ''}`;
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
        
        console.log(`${genreName} Movies (${sortBy}):`, data);

        if (data.results && data.results.length > 0) {
            const container = document.querySelector(containerSelector);
            const cards = container.querySelectorAll('.movieCard');
            
            cards.forEach((card, index) => {
                if (data.results[index]) {
                    const movie = data.results[index];
                    updateMovieCard(card, movie, index);
                }
            });
        }
    } catch (error) {
        console.error(`Error loading ${genreName} section:`, error);
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
  constructor(movieID, title, poster, overview){
        this.movieID = movieID;  // ADDED this line - KAZ
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

        let movieID = data.results[i].id;  // ADDED this line - KAZ
        let title = data.results[i].title;
        let poster = data.results[i].poster_path;
        //OGoverview gets the overview and overview makes it shorter so that if it doesn't fit the content gets cut.
        let OGoverview = data.results[i].overview;
        let overview = OGoverview.length > 200 ? OGoverview.substring(0, 200) + ' ...' : OGoverview;

        popMovies.push(window["movie_" + i] = new PopularMovies(movieID, title, poster, overview)); // ADDED movieID
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

    //  ADDED To Make Star Picks cards clickable
    const popularMappings = [
        { titleId: 'titlePopular1', index: 0 },
        { titleId: 'titlePopular2', index: 1 },
        { titleId: 'titlePopular3', index: 17 },
        { titleId: 'titlePopular4', index: 3 },
        { titleId: 'titlePopular5', index: 18 }
    ];
    
    popularMappings.forEach(mapping => {
        const h3Element = document.getElementById(mapping.titleId);
        if (h3Element && popMovies[mapping.index]) {
            const parentLink = h3Element.closest('a');
            if (parentLink) {
                parentLink.onclick = (e) => {
                    e.preventDefault();
                    window.location.href = `pages/individualMovie/movie-template.html?movieId=${popMovies[mapping.index].movieID}`;
                };
            }
        }
    });
    console.log("Star Picks links activated");
    //  END OF ADDITION 
    
}();

//Top Rated Movies
class TopMovies {
  constructor(movieID, title, poster, overview){ // ADD movieID
        this.movieID = movieID; // ADDED this line - KAZ
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
        
        let movieID = data.results[i].id;  // ADDED this line - KAZ
        let title = data.results[i].title;
        let poster = data.results[i].poster_path;
        let OGoverview = data.results[i].overview;
        let overview = OGoverview.length > 200 ? OGoverview.substring(0, 200) + ' ...' : OGoverview;

        topMovies.push(window["movie_" + i] = new TopMovies(movieID, title, poster, overview)); // ADDED movieID - KAZ
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

    //  ADDED To Make Top Rated cards clickable 
    const topMappings = [
        { titleId: 'titleTop1', index: 0 },
        { titleId: 'titleTop2', index: 1 },
        { titleId: 'titleTop3', index: 17 },
        { titleId: 'titleTop4', index: 3 },
        { titleId: 'titleTop5', index: 18 }
    ];
    
    topMappings.forEach(mapping => {
        const h3Element = document.getElementById(mapping.titleId);
        if (h3Element && topMovies[mapping.index]) {
            const parentLink = h3Element.closest('a');
            if (parentLink) {
                parentLink.onclick = (e) => {
                    e.preventDefault();
                    window.location.href = `pages/individualMovie/movie-template.html?movieId=${topMovies[mapping.index].movieID}`;
                };
            }
        }
    });
    console.log("Top Rated links activated");
    //  END OF ADDITION 
    
}();