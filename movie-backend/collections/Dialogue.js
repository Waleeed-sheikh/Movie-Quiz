import mongoose from "mongoose"

const dialogueSchema =new mongoose.Schema({
    question:{type:String,required:true},
    options:{type:[String],required:true},
    correctAnswer:{type:String,required:true},
    movie:{type:String,required:true},
    year:{type:String,required:true},
    character:{type:String,required:true},
    difficulty:{type:String,enum:["Easy","Medium","Hard"],required:true}
})

const Dialogue = mongoose.model("Dialogue",dialogueSchema,"DialogueQuestions")

export default Dialogue;