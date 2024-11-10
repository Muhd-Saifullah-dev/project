import { v2 as cloudinary } from "cloudinary";
import {
  CLAUDHINARY_API_KEY,
  CLAUDHINARY_CLOUD_NAME,
  CLAUDHINARY_SECRET_KEY,
} from "../configs/config.js";
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

    fs.unlinkSync(LocalfilePath);
    return response.secure_url;
  } catch (error) {
    fs.unlinkSync(LocalfilePath); //remove the locally saved temperory file as the upload option got failed
  }
};




export { uploadClaudhinaryFile };
