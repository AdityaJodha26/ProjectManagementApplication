import {ApiResponse} from "../utils/apiResponse.js" ; 

const healthcheck = (req , res) =>{
    try{
        res.status(200).json(new ApiResponse(200 , {message:"Server is running"}))
    }catch(error){

    }
}
export {healthcheck} ; 