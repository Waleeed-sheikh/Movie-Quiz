import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema({
    quote:{type:String,required:true},
    movie:{type:String,required:true},
    character:{type:String,required:true}
})

const Quote= mongoose.model("Quote",quoteSchema,"CustomQuotes");

export default Quote;