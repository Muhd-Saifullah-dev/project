import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
import {MONGO_URI} from "../configs/config.js"

const connectDB=async()=>{
    try {
       const connectionInstance= await mongoose.connect(`${MONGO_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("ERROR MONGODB CONNECTION FAILED !!! : ",error)
        process.exit(1)
    }
}


export default connectDB