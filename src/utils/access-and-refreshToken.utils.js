import { User } from "../models/user.model.js";


const generateAccessTokenAndRefreshToken=async(userId)=>{
   const user= await User.findById(userId)
  const accessToken= await user.generateAccessToken()
  const refreshToken=await user.generateRefreshToken()
  user.refreshToken=refreshToken
  await user.save({validateBeforeSave:true})
  return {accessToken,refreshToken}
}

export {
    generateAccessTokenAndRefreshToken
}