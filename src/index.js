import mongoose from "mongoose";
import {DB_NAME } from "./constant"















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