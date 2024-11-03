import { handleError } from "../utils/handlerError.utils.js";

const ErrorMiddleware=async(error,req,res,next)=>{
    const message=error.message ?? "Something went wrong";
    const status=error.status ?? 500;
    handleError(res,status,message,null)
}

export {ErrorMiddleware}
