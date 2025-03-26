 import fetch from "node-fetch"; // Required for Node.js v16 or earlier

// // const API_KEY = "44f64a38"; // Replace with your OMDB API key
// // const BASE_URL = "http://www.omdbapi.com/";


// // const allMovieNames=[];

// // async function movieNamesByYear(year) {

// //     let page = 1;
// //     let hasMorePages=true;

// //     while(hasMorePages){

// //         const url = `http://www.omdbapi.com/?apikey=44f64a38&s=movie&y=${year}&page=${page}`; 
        

// //         try{
// //         const response = await fetch(url);
// //         const data = await response.json();

// //         if(data.Response=="True" && data.Search){
            
// //             allMovieNames.push(...data.Search.map(movie=>movie.imdbID))
// //             page++
// //         }
// //         else{
// //             console.log(`No result for ${year} (Response : ${data.Response})`);
// //             hasMorePages=false;
// //         }

// //         }
// //         catch(error){

// //             console.log(`Error Fetching ${year} : `, error);
// //             hasMorePages=false
// //         }
       
// //     }
    
// // }

// // async function getMovie(startYear,finalYear){

// //     for(let year=startYear;year<=finalYear;year++){

// //         console.log(`Fetching Movies for Year ${year}.`)

// //         await movieNamesByYear(year)
// //     }

// //     console.log(`\n✅ Total Movies Fetched: ${allMovieNames.length}`);
// //     console.table(allMovieNames);
// // }

// // getMovie(2020,2020)



// const API_KEY = "44f64a38";  // Replace with your actual API key
// export const allMovieNames = [];

// async function movieNamesByYear(year) {
//     let page = 1;
//     let hasMorePages = true;

//     while (hasMorePages) {
//         const url = `http://www.omdbapi.com/?apikey=${API_KEY}&s=movie&y=${year}&page=${page}`;

//         try {
//             const response = await fetch(url);
//             const data = await response.json();

//             if (data.Response === "True" && data.Search) {
//                 const imdbIDs = data.Search.map(movie => movie.imdbID);

//                 // 🔥 Process movie details in BATCHES of 10
//                 for (let i = 0; i < imdbIDs.length; i += 10) {
//                     const batch = imdbIDs.slice(i, i + 10);

//                     // Fetch movie details for this batch
//                     const moviePromises = batch.map(id =>
//                         fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`).then(res => res.json())
//                     );

//                     const movies = await Promise.all(moviePromises);

//                     // Filter movies with IMDb rating >= 7
//                     const topRatedMovies = movies.filter(movie => parseFloat(movie.imdbRating) >= 7);

//                     // Store only the names of filtered movies
//                     allMovieNames.push(...topRatedMovies.map(movie => `${movie.Title} (${movie.imdbRating})`));

//                     // ⏳ Optional: Add delay to avoid API rate limits
//                     await new Promise(resolve => setTimeout(resolve, 1000));  // Wait 1 sec before next batch
//                 }

//                 page++;
//             } else {
//                 console.log(`No result for ${year} (Response: ${data.Response})`);
//                 hasMorePages = false;
//             }
//         } catch (error) {
//             console.log(`Error Fetching ${year}:`, error);
//             hasMorePages = false;
//         }
//     }
// }

// async function getMovie(startYear, finalYear) {
//     for (let year = startYear; year <= finalYear; year++) {
//         console.log(`Fetching Movies for Year ${year}...`);
//         await movieNamesByYear(year);
//     }

//     console.log(`\n✅ Total High-Rated Movies Fetched: ${allMovieNames.length}`);
//     console.table(allMovieNames);
// }

// // Fetch movies from 2020 to 2020 with IMDb rating >= 7
//  let moviesNames=getMovie(2020, 2020);

//  export let names=moviesNames

 
// console.log(names)

const API_KEY = "44f64a38"; // Replace with your API key


/**
 * Fetches movies for a given year and filters those with an IMDb rating of 6.5 or higher.
 */
async function fetchMoviesByYear(year) {
    let page = 1;
    let hasMorePages = true;

    while (hasMorePages) {
        // Adding `s=movie` to ensure results are returned
        const url = `http://www.omdbapi.com/?apikey=${API_KEY}&s=movie&type=movie&y=${year}&page=${page}`;
        console.log(`Fetching movies for ${year}, Page: ${page}`);

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.Response === "True" && data.Search) {
                // Fetch detailed data for each movie to get IMDb rating
                const movieDetails = await Promise.all(
                    data.Search.map(movie =>
                        fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`)
                            .then(res => res.json())
                    )
                );

                // Filter and store movies with IMDb rating >= 6.5
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

                page++; // Move to the next page
            } else {
                hasMorePages = false; // No more movies to fetch
            }
        } catch (error) {
            console.error(`Error fetching movies for ${year}:`, error);
            hasMorePages = false;
        }
    }
}

/**
 * Fetches and stores movies from 1995 to 2024.
 */
export let allMovies = [];
export async function fetchAllMovies() {
    for (let year = 1995; year <= 2025; year++) {
        await fetchMoviesByYear(year);
    }

    console.log(`\n✅ Total High-Rated Movies Fetched: ${allMovies.length}`);
    console.table(allMovies);
}

export function getAllMovies() {
    return allMovies; // Return the stored movies
}