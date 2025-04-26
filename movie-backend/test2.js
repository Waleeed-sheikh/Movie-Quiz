import mongoose from 'mongoose';
import fetch from 'node-fetch';
import connectDB from './db.js';
import MovieNames from './collections/MovieNames.js';


connectDB()


async function fetchMoviesByTitle(letter, year, page = 1) {
    try {
        const apiKey = '44f64a38'; 
        const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=${letter}&y=${year}&type=movie&page=${page}`;

        console.log(`🔎 Fetching URL: ${url}`);

        const response = await fetch(url);
        //x
        const data = await response.json();

        console.log(`📢 API Response:`, data); 

        if (data.Error) {
            console.error(`❌ OMDB Error: ${data.Error}`);
            return [];
        }

        return data.Search || [];
    } catch (error) {
        console.error("❌ API Fetch Error:", error);
        return [];
    }
}


async function fetchAndStoreMovies() {
    let moviesFrom1995 = [];
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    for (let letter of alphabet) {
        console.log(`🚀 Fetching movies starting with "${letter}" for 1995`);
        
        for (let page = 1; page <= 3; page++) {  
            const movies = await fetchMoviesByTitle(letter, 1995, page);

            if (movies.length === 0) break; 

            
            for (let movie of movies) {
                const detailsUrl = `http://www.omdbapi.com/?apikey=44f64a38&i=${movie.imdbID}`;
                const detailsResponse = await fetch(detailsUrl);
                const detailsData = await detailsResponse.json();

                if (detailsData.imdbRating && parseFloat(detailsData.imdbRating) >= 6.5) {
                    moviesFrom1995.push({ name: detailsData.Title });
                }
            }
        }
    }

    console.log(`✅ Total High-Rated Movies Fetched: ${moviesFrom1995.length}`);
    
    try {
        if (moviesFrom1995.length > 0) {
            await MovieNames.insertMany(moviesFrom1995);
            console.log("🎉 Movies successfully stored in the database!");
        } else {
            console.log("⚠️ No movies met the criteria.");
        }
    } catch (error) {
        console.error("❌ Error storing movies in DB:", error);
    }

    mongoose.connection.close();
}


fetchAndStoreMovies();
