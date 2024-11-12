import { Router } from "express";
import userRouter from "./user.routes.js";
import videoRoute from "./video.routes.js"
const rootRouter=Router()

rootRouter.use("/users",userRouter)
rootRouter.use("/videos",videoRoute)


export default rootRouter

