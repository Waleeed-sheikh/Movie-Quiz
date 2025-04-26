 import fetch from "node-fetch"; 



const API_KEY = "44f64a38"; 

async function fetchMoviesByYear(year) {
    let page = 1;
    let hasMorePages = true;

    while (hasMorePages) {
        const url = `http://www.omdbapi.com/?apikey=${API_KEY}&s=movie&type=movie&y=${year}&page=${page}`;
        console.log(`Fetching movies for ${year}, Page: ${page}`);

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.Response === "True" && data.Search) {
                
                const movieDetails = await Promise.all(
                    data.Search.map(movie =>
                        fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`)
                            .then(res => res.json())
                    )
                );

            
                movieDetails.forEach(movie => {
                    const rating = parseFloat(movie.imdbRating);
                    if (!isNaN(rating) && rating >= 6.5) {
                        allMovies.push({
                            title: movie.Title,
                            year: movie.Year,
                            rating: movie.imdbRating
                        });
                    }
                });

                page++; 
            } else {
                hasMorePages = false; 
            }
        } catch (error) {
            console.error(`Error fetching movies for ${year}:`, error);
            hasMorePages = false;
        }
    }
}


export let allMovies = [];
export async function fetchAllMovies() {
    for (let year = 1995; year <= 2025; year++) {
        await fetchMoviesByYear(year);
    }

    console.log(`\n✅ Total High-Rated Movies Fetched: ${allMovies.length}`);
    console.table(allMovies);
}

export function getAllMovies() {
    return allMovies; 
}