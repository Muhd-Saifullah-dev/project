import { v2 as cloudinary } from "cloudinary";
import {
  CLAUDHINARY_API_KEY,
  CLAUDHINARY_CLOUD_NAME,
  CLAUDHINARY_SECRET_KEY,
} from "../configs/config";
import fs from "fs";

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

    console.log("File upload Cloud SuccessFully !! ",response)
    return response
  } catch (error) {
    fs.unlinkSync(LocalfilePath)  //remove the locally saved temperory file as the upload option got failed
  }
};

export { cloudinary };
