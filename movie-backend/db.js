import mongoose, { Mongoose } from "mongoose";

const conString="mongodb+srv://Movie-Quotes:expectopatronum@movie-cluster.9hoje.mongodb.net/waleedKQuotes"

const connectDB = async()=>{

    try{
        if(mongoose.connection.readyState===1){
            console.log("Already connected to MongoDB ✅");
            return
        }
        await mongoose.connect(conString);
        console.log("MongoDB Connected ✅");
    }
    catch(error){
        throw new Error("Database connection failed!"); 
    }
};

export default connectDB



// mongoose.connect(conString);

// const db=mongoose.connection

// db.on("connected",()=>{
//     console.log("Mongo successfully connected!")
// })

// db.on("error",(err)=>{
//     console.error("MongoDB connection ever ❌",err);
// })

// export default db