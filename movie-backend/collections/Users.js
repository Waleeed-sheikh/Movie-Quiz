import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    userName:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    totalScore:{type:Number,default:0},
    currentScore:{type:Number,default:0}
})

const Users=mongoose.model("Users",userSchema,"palyers/users")

export default Users;