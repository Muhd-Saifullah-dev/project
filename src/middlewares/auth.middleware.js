import { ApiError, ValidationError } from "../utils/ApiError.utils.js";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "../configs/config.js";
import { User } from "../models/user.model.js";

const verifyJWT = async (req, _, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization").replace("Bearer ", "");
    if (!accessToken) {
      throw new ApiError("Token is not valid", 401);
    }
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ValidationError("Invalid access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("ERROR IN AUTH :: ", error);
  }
};

const refreshAccessTokenMiddle = (req, _, next) => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiError("Unauthorized request", 400);
    }
    const decoded = jwt.verify(incomingRefreshToken, REFRESH_TOKEN_SECRET);
    req.userId = decoded._id;
    console.log("decodeId", req.userId);
    next();
  } catch (error) {
    console.log("ERROR IN REFRESH TOKEN", error);
  }
};

export { verifyJWT, refreshAccessTokenMiddle };
