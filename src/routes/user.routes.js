import { Router } from "express";
import { incomingCallRefreshToken, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { refreshAccessTokenMiddle, verifyJWT } from "../middlewares/auth.middleware.js";
const userRouter = Router();

userRouter.post(
  "/",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

userRouter.post("/login", loginUser);

userRouter.post("/logout",verifyJWT,logoutUser);
userRouter.post("/refresh-token",refreshAccessTokenMiddle,incomingCallRefreshToken)
export default userRouter;
