import { v2 as cloudinary } from "cloudinary";
import {
  CLAUDHINARY_API_KEY,
  CLAUDHINARY_CLOUD_NAME,
  CLAUDHINARY_SECRET_KEY,
} from "../configs/config.js";
import fs from "fs";

import { ApiError } from "./ApiError.utils.js";

cloudinary.config({
  api_key: CLAUDHINARY_API_KEY,
  api_secret: CLAUDHINARY_SECRET_KEY,
  cloud_name: CLAUDHINARY_CLOUD_NAME,
});

const uploadClaudhinaryFile = async (LocalfilePath) => {
  try {
    if (!LocalfilePath) return null;

    const response = await cloudinary.uploader.upload(LocalfilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(LocalfilePath);
    return response.secure_url;
  } catch (error) {
    fs.unlinkSync(LocalfilePath); //remove the locally saved temperory file as the upload option got failed
  }
};


const extractPublicIdFromSecureUrl=async(imageurl)=>{
  const part=imageurl.split("/")
  const part1=part.pop()
  const part2 =part1.split('.')
  const publicId=part2[0]
  return publicId
}


const deleteCloudhinary = async (imageSecureUrl) => {
  try {
    if(!imageSecureUrl){
      console.log("image secure Url is not found")
     return null
    }
    const publicId=extractPublicIdFromSecureUrl(imageSecureUrl)
    const deletePreviousImage = await cloudinary.uploader.destroy(publicId,{
      resource_type:"auto"
    });
    if (!deletePreviousImage) return null;
    console.log("DELETING PREVIOUS : ",deletePreviousImage)
    return deletePreviousImage
  } catch (error) {
    console.log("ERROR IN DELETE PREVIOUS IMAGE :: ",error)
  }
};

export { uploadClaudhinaryFile,deleteCloudhinary };
