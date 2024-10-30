import { app } from "./app.js"
import { PORT } from "./configs/config.js"
import connectDB from "./db/index.js"




connectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is Running at PORT : ${PORT}`)
    })
})
.catch((err)=>{
    console.log('Error in callback mongodb Connection ||| ' , err)
})










/*
import express from "express";
const app=express()
;(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("ERROR : ",error)
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`App listen to this port : ${process.env.PORT}`)
        })
    } catch (error) {
        console.log("ERROR : ",error)
        throw error
    }
})()
    */