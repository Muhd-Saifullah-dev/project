import mongoose from "mongoose";
import { DB_NAME } from "../constant";
import {MONGO_URI} from "../configs/config"

const connectDB=async()=>{
    try {
       const connectionInstance= await mongoose.connect(`${MONGO_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST : ${connectionInstance}`);
        
    } catch (error) {
        console.log("ERROR : ",error)
        process.exit(1)
    }
}


export default connectDB