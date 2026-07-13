import {ApiResponse} from "../utils/apiResponse.js" ; 

/*
const healthcheck = (req , res , next ) =>{
    try{
        res.status(200).json(new ApiResponse(200 , {message:"Server is running"}))
    }catch(error){
        next(error) ; 

    }
}
    */
import { asyncHandler } from "../utils/async-handler.js";
const healthcheck = asyncHandler( async(req , res)=>{
    res.status(200).json( new ApiResponse(200 , {message : "Server is still running "}))
})
export {healthcheck} ; 