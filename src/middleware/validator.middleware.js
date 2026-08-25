import {validationResult} from "express-validator" ;
import {ApiErrors} from "../utils/apiErrors.js";

export const validate = (req , res , next) => {
    const errors = validationResult(req) ;
    if(errors.isEmpty()){
        return next();
    }
    const extractedErrors = [] ;
    errors.array().forEach((err)=>
        extractedErrors.push({
            [err.path]:err.msg ,
        }),
    )
    throw new ApiErrors(422 , "Received data is not valid" , extractedErrors) ;

};

