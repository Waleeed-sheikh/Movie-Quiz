import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Users from "../collections/Users.js"


const userRouter=express.Router();

userRouter.post("/signup",async(req,res)=>{
    const {userName,password}=req.body

    try{
        const exsistingUser= await Users.findOne({userName})
        if(exsistingUser) {
            return res.status(400).json({message:"User already exsists!"})
        }

        const hashedPassword= await bcrypt.hash(password,10);
        const newUser=new Users({userName,password:hashedPassword});
        await  newUser.save();

        res.status(201).json({message:"User created Successfully!"})
    }
    catch(error){
        res.status(500).json({message:"Signup Failed!",error})
    }
})


userRouter.post("/login",async (req,res)=>{
    const {userName,password}=req.body;

    try{
        const user= await Users.findOne({userName});
        if(!user){
            return res.status(404).json({message:"User not found!"})
        }

        const isPasswordCorrect= await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid Password!"})
        }

        const token=jwt.sign({id:user._id,username:user.userName},"SECRET-KEY",{expiresIn:"6h"})
        res.status(200).json({token,userName:user.userName,message:"Logged In Successfully!"})
    }
    catch(error){
        res.status(500).json({message:"Login Failed!",error})
    }
})

export default userRouter;