import { User } from "../models/users.models.js";
import { ApiErrors } from "../utils/apiErrors.js" ; 
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";
import { AvailableUserRole } from "../utils/constants.js";

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

export const validateProjectPermission = (roles = []) => {
    asyncHandler( async (req ,res)=>{

        const {projectId} = req.params 
        if(!projectId){
            throw new ApiError(403 , "Project with this projectId doesnt exist")
        }

        const projectMember = await ProjectMember.findById({
            project: new mongoose.Types.ObjectId(projectId) ,
            user:  new mongoose.Types.ObjectId(userId)
        })
        if(!projectMember) {
            throw new ApiError(403 , "project doesnt exist")
        }

        const givenrole = projectMember?.roles
        req.user.role = givenrole

        if(!roles.includes(givenrole)){
            throw new ApiErrors(402 , "given role doesnt exist")
        }

        next()


    
    })
}






