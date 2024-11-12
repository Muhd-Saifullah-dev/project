
import { Video } from "../models/video.model.js";
import {okResponse} from "../utils/handlerError.utils.js"
import mongoose from "mongoose"
const getAllVideos=async(req,res)=>{
   try {
     const {page=1,limit=10,query,sortBy="createdAt", sortType = 'desc',userId}=req.query;
     let matchConditons={}
 
     if(query){
         matchConditons={
             $text:{$search:query}
     }
 }
 
     if(userId){
         matchConditons.owner=new mongoose.Types.ObjectId(userId)
     }
 
     const aggregateQuery=[
     {
         $match:matchConditons
     },
     {
         $sort:{
             [sortBy]: sortType === 'asc' ? 1 : -1 
         }
     },
     {
         $skip:(page-1)*limit
     },
     {
         $limit:parseInt(limit)
     },
     {
         $lookup:{
             from:"users",
             localField:"owner",
             foreignField:"_id",
             as:"ownerDetails"
         }
     },
     {
         $project:{
             videoFile:1,
             thumbnail:1,
             title:1,
             description:1,
             duration:1,
             duration: 1,
             isPublished:1,
             owner:1,
             ownerDetails: { username: 1 },
             createdAt:1,
             
         }}]
 
         const video=await Video.aggregatePaginate(aggregateQuery,{
             page, limit 
         })
 
         const totalCounts=await Video.countDocuments(matchConditons)
         const totalPage=Math.ceil(totalCounts/parseInt(limit))
         return okResponse(res,"get All videos Fetched Successfully ",
             {video,totalCounts,totalPage,page,limit},200
         )
   } catch (error) {
        console.log("ERROR IN GET ALL VIDEOS"   ,   error)
   }
}

export{
    getAllVideos
}