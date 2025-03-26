import mongoose from "mongoose";
import connectDB from "./db.js";

import Quiz from './collections/Quiz.js'
import Dialogue from "./collections/Dialogue.js";

connectDB()
const sample={
    question:"Who said this  I am your daddy",
    options:["terminator","GodFather"],
    correctAnswer:"terminaot",
    character:"Waleed",
    difficulty:"Medium",
    year:"2010",
    movie:"terminator"
    
}

const seedDatabase = async ()=>{

    try{
        await Dialogue.insertMany([sample]);
        console.log("Sample quotes added!");
        mongoose.connection.close();
    }
    catch(error){
        console.log("error seeding database",error)
    }
};

seedDatabase();