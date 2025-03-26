import mongoose from "mongoose";

const movieNamesSchema = new mongoose.Schema({
    name: { type: String, required: true }
});
const MovieNames =mongoose.model("MovieNames",movieNamesSchema,"MovieNames")

export default MovieNames;