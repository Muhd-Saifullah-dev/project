import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  incomingCallRefreshToken,
  loginUser,
  logoutUser,
  registerUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  refreshAccessTokenMiddle,
  verifyJWT,
} from "../middlewares/auth.middleware.js";
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

userRouter.post("/logout", verifyJWT, logoutUser);

userRouter.post(
  "/refresh-token",
  refreshAccessTokenMiddle,
  incomingCallRefreshToken
);

userRouter.get("/current-user", verifyJWT, getCurrentUser);

userRouter.post("/change-password", verifyJWT, changeCurrentPassword);

userRouter.patch(
  "/change-avatar",
  verifyJWT,
  upload.single("avatar"),
  updateAvatar
);

userRouter.patch(
  "/cover-image",
  verifyJWT,
  upload.single("coverImage"),
  updateCoverImage
);

userRouter.patch("/update-account", verifyJWT, updateAccountDetails);

userRouter.get("/channel/:username", verifyJWT, getUserChannelProfile);

userRouter.get("/watch-history", verifyJWT, getWatchHistory);
export default userRouter;
