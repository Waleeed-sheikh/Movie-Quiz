import express from "express"
import cors from "cors"
import connectDB from "./db.js"
import quotesRouter from "./Routes/QuotesRoutes.js";
import userRouter from './Routes/UserRoutes.js'
import questionRouter from "./Routes/QuestionRoutes.js";

const app=express();

app.use(cors())
app.use(express.json())
connectDB();
app.use("/quotes",quotesRouter)
app.use("/users",userRouter)
app.use("/questions",questionRouter)
const PORT=5000;
app.listen(PORT,()=>console.log("Backend Running Successfully!"))

//xmlhttprequest , axios, fetch, promises async await 
