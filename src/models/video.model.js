import mongoose,{Schema} from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema =new Schema({
    videoFile:{
        type:String,   //claudhinary url
        required:[true, "video is required"]
    },
    thumbnail:{
        type:String,    //claudhinary url
        required:[true , "thumbnail is required"]
    },
    title:{
        type:String,
        required:[true , "title is required"]
    },
    description:{
        type:String,
        required:[true , "description is required"]
    },
    duration:{
        type:Number,  // claudhinary
        required:true
    },
    views:{
        type:Number,
        default:0,
       
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{

    }
}, {timestamps:true})

videoSchema.plugin(aggregatePaginate)
export const Video=mongoose.model("Video",videoSchema)