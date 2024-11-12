import { ApiError, ValidationError } from "../utils/ApiError.utils.js";
import { User } from "../models/user.model.js";
import { uploadClaudhinaryFile } from "../utils/claudhinary.utils.js";
import { okResponse } from "../utils/handlerError.utils.js";
import { generateAccessTokenAndRefreshToken } from "../utils/access-and-refreshToken.utils.js";
import mongoose from "mongoose";
import { deleteCloudhinary } from "../utils/delete-image-claudhinary.utils.js";

const registerUser = async (req, res, next) => {
  try {
    // get user detailed from frontend
    // validation = not empty
    // check user is already exist = username or emails
    // check for image and avatar
    // upload them on claudhinary, avatar
    // create user object -- create data entry in db
    // remove password and refresh token field from response
    // check for user creation

    const { username, fullName, email, password } = req.body;
    // validation
    if (
      [fullName, username, email, password].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new ValidationError("All field are required");
    }
    const existedUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existedUser) {
      throw new ApiError(
        "User with username and email is already exist !",
        409
      );
    }

    console.log("REQ FILES", req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path;

    let coverImageLocalPath;
    if (
      req.files &&
      Array.isArray(req.files.coverImage) &&
      req.files.coverImage.length > 0
    ) {
      console.log("coverImage length", req.files.coverImage.length);
      coverImageLocalPath = req.files.coverImage[0].path;
    }

    console.log("avatarLocalPath", avatarLocalPath);
    if (!avatarLocalPath) {
      throw new ApiError("avatar field is required");
    }
    const avatar = await uploadClaudhinaryFile(avatarLocalPath);
    const coverImage = await uploadClaudhinaryFile(coverImageLocalPath);

    if (!avatar) {
      throw new ApiError("Avatar is not uploading on cloudhinary", 400);
    }

    const user = await User.create({
      fullName,
      avatar: avatar,
      coverImage: coverImage || "",
      username: username.toLowerCase(),
      password,
      email,
    });

    await user.save();
    (user.password = undefined), (user.refreshToken = undefined);
    user.email = undefined;

    return okResponse(res, "user created Successfully !! ", user, 200);
  } catch (error) {
    // if(error.code===11000){
    //     console.log("DUPLIATED ERROR")
    // }else{
    //     console.log("ERROR IN REGISTER USER ...",error)
    // }
    console.log("ERROR IN REGISTER USER ...", error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    // get user details email and password
    // verify user detail in db
    // give me access token and refresh token
    // send cookies

    const { username, email, password } = req.body;
    if (!(username || email)) {
      throw new ValidationError("username or email is required ");
    }
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      throw new ValidationError("User doesnot exist");
    }
    // check password is match
    const isPasswordValid = await user.isPasswordCorrect(password);
    console.log("Provided Password: ", password);
    console.log("Stored Hashed Password: ", user.password);
    if (!isPasswordValid) {
      throw new ApiError("invalid user credientials", 401);
    }

    // generate Access token and Refresh Token
    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    const option = {
      httpOnly: true,
      secure: true,
    };

    res.cookie("accessToken", accessToken, option);
    res.cookie("refreshToken", refreshToken, option);
    user.refreshToken = undefined;
    user.password = undefined;
    return okResponse(res, "user loggedIn successfully", user, 200, {
      access: accessToken,
      refresh: refreshToken,
    });
  } catch (error) {
    console.log("ERROR:: ", error);
  }
};

const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      {
        new: true,
      }
    );

    const option = {
      httpOnly: true,
      secure: true,
    };
    res.clearCookie("accessToken", option);
    res.clearCookie("refreshToken", option);

    return okResponse(res, "user logged Out", {}, 200);
  } catch (error) {
    console.log("ERROR IN LOGOUT : ", error);
  }
};

const incomingCallRefreshToken = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      throw new ApiError("Invalid token", 404);
    }

    if (req.cookies?.refreshToken !== user.refreshToken) {
      throw new ApiError("refresh token is expired", 403);
    }
    const option = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    res.cookie("accessToken", accessToken, option);
    res.cookie("refreshToken", refreshToken, option);
    return okResponse(res, "Access token refreshed successfully", {}, 200, {
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.log("ERROR IN INCOMING REQUEST", error);
  }
};

const changeCurrentPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);
    if (!user) {
      throw new ApiError("User not logged in", 401);
    }
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
      throw new ApiError("Invalid old password");
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return okResponse(res, "password changed successfully !", {}, 200);
  } catch (error) {
    console.log("ERROR IN PASSWORD CHANGE : ", error);
  }
};

const getCurrentUser = async (req, res) => {
  try {
    return okResponse(res, "fetched user ! ", req.user, 201);
  } catch (error) {
    console.log("ERROR IN GETCURRENTUSER : ", error);
  }
};

const updateAccountDetails = async (req, res) => {
  try {
    const { fullName, email } = req.body;
    if (!fullName || !email) {
      throw new ApiError("email and fullName is required", 401);
    }
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          fullName: fullName,
          email: email,
        },
      },
      { new: true }
    ).select("-password -refreshToken");
    if (!user) {
      throw new ApiError("user not found please login Again", 400);
    }
    return okResponse(
      res,
      "Accounts details updated successfully !",
      user,
      200
    );
  } catch (error) {
    console.log("ERROR IN UPDATE ACCOUNTS : ", error);
  }
};

const updateAvatar = async (req, res) => {
  try {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
      throw new ApiError("avatar file is missing !", 401);
    }
    const avatar = await uploadClaudhinaryFile(avatarLocalPath);
    if (!avatar) {
      throw new ApiError(
        "error while uploading the avatar on cloudhinary",
        400
      );
    }
    const user = await User.findById(req.user?._id);
    if (!user) {
      throw new ApiError("User not found, please login again", 402);
    }

    // deleting the previous Image the cloudhinary
    const publicIdAvatar = user.avatar;
    const deleteAvatar = await deleteCloudhinary(publicIdAvatar);
    console.log("delete avatar Id  : ", deleteAvatar);
    console.log("Public Id", publicIdAvatar);
    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          avatar: avatar,
        },
      },
      { new: true }
    ).select("-password -refreshToken");
    if (!user) {
      throw new ApiError("user not found please login again ", 402);
    }
    return okResponse(
      res,
      "Accounts avatar  updated successfully !",
      updatedUser,
      200
    );
  } catch (error) {
    console.log("ERROR AVATAR UPDATE ", error);
  }
};

const updateCoverImage = async (req, res) => {
  try {
    const coverImageLocalPath = req.file?.path;
    console.log("COVER IMAGE PATH  : ", req.file);
    if (!coverImageLocalPath) {
      throw new ApiError("cover image is missing", 401);
    }
    const coverImage = await uploadClaudhinaryFile(coverImageLocalPath);
    if (!coverImage) {
      throw new ApiError("cover Image is not uploading", 400);
    }
    const user = await User.findById(req.user?._id);
    if (!user) {
      throw new ApiError("user not found please Login");
    }
    if (user?.coverImage.length > 0) {
      await deleteCloudhinary(user.coverImage);
    }

    const updateCoverImage = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          coverImage: coverImage,
        },
      },
      { new: true }
    ).select("-password -refreshToken");

    return okResponse(
      res,
      "Accounts cover Image updated successfully !",
      updateCoverImage,
      200
    );
  } catch (error) {
    console.log("ERROR IN UPLOAD COVER IMAGE ,", error);
  }
};

const getUserChannelProfile = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username?.trim()) {
      throw new ApiError("username is missing", 401);
    }
    const channel = await User.aggregate([
      {
        $match: {
          username: username?.toLowerCase(),
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribedTo",
        },
      },
      {
        $addFields: {
          subscriberToCount: {
            $size: "$subscribers",
          },
          channelsubscribedToCount: {
            $size: "$subscribedTo",
          },
          isSubcribed: {
            $cond: {
              if: { $in:[req.user?._id, "$subscribers.subscriber"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          fullName: 1,
          username: 1,
          subscriberToCount: 1,
          channelsubscribedToCount: 1,
          email: 1,
          avatar: 1,
          coverImage: 1,
          isSubcribed: 1,
        },
      },
    ]);

    if (!channel?.length) {
      throw new ApiError("channel doest not exist", 400);
    }

    return okResponse(
      res,
      "user channel fetched Successfully",
      channel[0],
      200
    );
  } catch (err) {
    console.log("ERROR IN GETUSER PROFILE CHANNEL", err);
  }
};

const getWatchHistory = async (req, res) => {
  try {
    const user = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.user?._id),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "watchHistory",
          foreignField: "_id",
          as: "watchHistory",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                  {
                    $project: {
                      fullName: 1,
                      username: 1,
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                owner: {
                  $first: "$owner",
                },
              },
            },
          ],
        },
      },
    ]);

    okResponse(
      res,
      "Watch history is fetched Successfully!",
      user[0].watchHistory,
      200
    );
  } catch (error) {
    console.log("ERROR IN GET WATCH HISTORY", error);
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  incomingCallRefreshToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateCoverImage,
  updateAvatar,
  getUserChannelProfile,
  getWatchHistory,
};
