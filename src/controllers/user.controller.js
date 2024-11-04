import { ApiError, ValidationError } from "../utils/ApiError.utils.js";
import { User } from "../models/user.model.js";
import {uploadClaudhinaryFile} from "../utils/claudhinary.utils.js"
import { okResponse } from "../utils/handlerError.utils.js";

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
   const existedUser= await User.findOne({
      $or: [{ email }, { username }],
    });

    if(existedUser){ throw new ApiError("User with username and email is already exist !",409) }
    
    console.log("REQ FILES",req.files)
    const avatarLocalPath= req.files?.avatar[0]?.path
        
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        console.log("coverImage length",req.files.coverImage.length)
        coverImageLocalPath=req.files.coverImage[0].path
    }

    console.log("avatarLocalPath",avatarLocalPath)
    if(!avatarLocalPath){
        throw new ApiError("avatar field is required")
    }
    const avatar=await uploadClaudhinaryFile(avatarLocalPath)
     const coverImage=await uploadClaudhinaryFile(coverImageLocalPath)
    

    if(!avatar){
        throw new ApiError("Avatar is not uploading on cloudhinary",400)
    }

   const user=await User.create({
        fullName,
        avatar:avatar,
        coverImage:coverImage || "",
        username:username.toLowerCase(),
        password,
        email
    })

    await user.save()
    user.password=undefined,
    user.refreshToken=undefined
    user.email=undefined

    return okResponse(res,"user created Successfully !! ",user,200)
  } catch (error) {
    // if(error.code===11000){
    //     console.log("DUPLIATED ERROR")
    // }else{
    //     console.log("ERROR IN REGISTER USER ...",error)
    // }
    console.log("ERROR IN REGISTER USER ...",error)

    }
};

export { registerUser };
