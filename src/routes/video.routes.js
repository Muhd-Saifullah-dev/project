import {Router} from "express"
import {getAllVideos} from "../controllers/video.controller.js"
const videoRoute=Router()

videoRoute.get("/",getAllVideos)


export default videoRoute