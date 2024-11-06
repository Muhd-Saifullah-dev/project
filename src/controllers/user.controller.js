import { ApiError, ValidationError } from "../utils/ApiError.utils.js";
import { User } from "../models/user.model.js";
import { uploadClaudhinaryFile } from "../utils/claudhinary.utils.js";
import { okResponse } from "../utils/handlerError.utils.js";
import { generateAccessTokenAndRefreshToken } from "../utils/access-and-refreshToken.utils.js";

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
    if (!username && !email) {
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
    res.clearCookie("accessToken", option)
    res.clearCookie("refreshToken",option)

    return okResponse(res,"user logged Out",{},200)
  } catch (error) {
    console.log("ERROR IN LOGOUT : ",error)
  }
};

export { registerUser, loginUser, logoutUser };
