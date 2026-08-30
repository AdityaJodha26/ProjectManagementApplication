import { User } from "../models/users.models.js";
import { ApiErrors } from "../utils/apiErrors.js" ; 
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async(req, res ,next)=>{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "Unauthorized request")

    if(!token){
        new ApiError(401 , "Unauthorized Access")

    }try{
        const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?.id).select("-password -refreshToken -userVerificationToken -emailVerificationExpiry")

        if(!user){
            new ApiError(402, "no user")
        }
        req.user = user
        next()
    }catch (error){
        throw new ApiError( 401 , " Invalid user ") 

    }
})