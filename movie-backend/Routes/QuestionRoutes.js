import express from "express";
import axios from "axios";
import Quiz from "../collections/Quiz.js";
import Dialogue from "../collections/Dialogue.js";
import { randomDirector, randomActor, randomYear, getARandomMovie, getQuizQuestionType,getMovieOrDialogue } from "../utils.js";

const questionRouter = express.Router();

questionRouter.get('/getMovieQuestions', async (req, res) => {
    try {
        const questionType = "movie";

        if (questionType === "movie") {
            const movieQuizQuestionType = getQuizQuestionType();
            const randomMovie = getARandomMovie();

            let exsistingQuestion = await Quiz.findOne({ movie: randomMovie, questionType: movieQuizQuestionType });
            if (exsistingQuestion) {
                return res.json(exsistingQuestion);
            }

            const response = await axios.get(`http://www.omdbapi.com/?apikey=44f64a38&t=${encodeURIComponent(randomMovie)}`);

            const { Director, Actors, Year, Plot, Title } = response.data;

            let question = "";
            let options = [];
            let correctAnswer = "";
            let difficulty = "";

           
            if (movieQuizQuestionType === "director") {
                question = `Who was the director of the Movie : ${Title} ?`;
                options = [randomDirector(), Director, randomDirector(), randomDirector()];
                options = options.sort(() => Math.random() - 0.5);
                correctAnswer = Director;
            }
           
            else if (movieQuizQuestionType === "year") {
                question = `In which year was the movie : ${Title} released?`;
                options = [Year, randomYear(parseInt(Year)), randomYear(parseInt(Year)), randomYear(parseInt(Year))];
                options = options.sort(() => Math.random() - 0.5);
                correctAnswer = Year;
            }
    
            else if (movieQuizQuestionType === "cast") {
                let castArray = [];
                if (Actors && typeof Actors === 'string') {
                    castArray = Actors.split(", ");
                }
                correctAnswer = castArray[0] || 'Unknown'; 
                question = `Who starred in the movie : ${Title}?`;
                options = [randomActor(), randomActor(), randomActor(), correctAnswer];
                options = options.sort(() => Math.random() - 0.5);
            }
      
            else if (movieQuizQuestionType === "plot") {
                question = `Which movie features the following plot : ${Plot} ?`;
                options = [Title, getARandomMovie(), getARandomMovie(), getARandomMovie()];
                options = options.sort(() => Math.random() - 0.5);
                correctAnswer = Title;
            }

          
            const releaseYear = parseInt(Year);
            if (releaseYear > 2015) {
                difficulty = "Easy";
            } else if (releaseYear <= 2015 && releaseYear > 2010) {
                difficulty = "Medium";
            } else {
                difficulty = "Hard";
            }

            
            const newQuestion = new Quiz({
                question,
                options,
                correctAnswer,
                questionType: movieQuizQuestionType,
                movie: Title,
                year: Year,
                director: Director,
                plot: Plot,
                difficulty: difficulty,
                cast: Actors ? Actors.split(", ") : [] 
            });
            await newQuestion.save();
            return res.json(newQuestion);
        } else {
            
            const randomDialogue = await Dialogue.aggregate([{ $sample: { size: 1 } }]);
            if (!randomDialogue.length) {
                return res.status(404).json({ message: "No Dialogue Question Found!" });
            }
            return res.json(randomDialogue[0]);
        }
    } catch (error) {
        console.error("❌ Error fetching question:", error);
        res.status(500).json({ message: "Error fetching question!", error });
    }
});

export default questionRouter;
