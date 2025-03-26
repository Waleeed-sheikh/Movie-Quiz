import express from "express"
import MovieQuote from "../collections/Quote.js"


const router = express.Router();


router.get("/waleed/getQuotes",async (req,res)=>{
   
    try{
        const quotes=await MovieQuote.find();
        res.json(quotes) 
    }
    catch(error){
        res.status(500).json({ error:"Error fetching the quotes"})
        console.log(error)
    }
})




router.post("/waleed/submit",async(req,res)=>{
    try{
        const {quote , movie , character}=req.body;

        if(!quote || !movie){
            return res.status(400).json({error:"Movie & Quote are Required!"})
        }

        const newQuote=new MovieQuote({quote,movie,character});

        await newQuote.save();

        res.status(201).json({message:"Quote added successfully!",data:newQuote})
    }
    catch(error){
        res.status(500).json({error:"Error Adding Quote!"})
        console.log(error)
    }
})


router.delete("/waleed/deleteQuote/:id",async(req,res)=>{
    try{

        await MovieQuote.findByIdAndDelete(req.params.id)
        res.json({message:"Quote is deleted successfully"})
    }
    catch (error){
        res.status(500).json({error:"Error deleting the quote!"})
        console.log(error)
    }
})

export default router;