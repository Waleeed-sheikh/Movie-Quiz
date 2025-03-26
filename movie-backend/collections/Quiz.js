import mongoose, { Mongoose } from "mongoose";

const quizSchema =new mongoose.Schema({
    question:{type:String,required:true},
    options:{type:[String],required:true},
    correctAnswer:{type:String,required:true},
    movie:{type:String,required:true},
    plot:{type:String,required:true},
    year:{type:String,required:true},
    director:{type:String,required:true},
    cast:{type:[String],required:true},
    difficulty:{type:String,enum:["Easy","Medium","Hard"],required:true},
    questionType:{type:String,required:true}
})


const Quiz=mongoose.model("QuizQuestions",quizSchema,"MovieInfoQuestions")

export default Quiz;