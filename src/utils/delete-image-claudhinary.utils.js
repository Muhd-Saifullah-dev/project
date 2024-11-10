import { v2 as cloudinary } from "cloudinary";

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
      const publicId= await extractPublicIdFromSecureUrl(imageSecureUrl)
      const deletePreviousImage = await cloudinary.uploader.destroy(publicId);
      if (!deletePreviousImage) return null;
      console.log("DELETING PREVIOUS : ",deletePreviousImage)
      return deletePreviousImage
    } catch (error) {
      console.log("ERROR IN DELETE PREVIOUS IMAGE :: ",error)
    }
  };


  export{
    deleteCloudhinary
  }