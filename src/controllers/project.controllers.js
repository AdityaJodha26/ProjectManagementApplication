import {User} from "../models/users.models.js" 
import {Project} from "../models/project.models.js"
import {ProjectMember} from "../models/projectmember.models.js"
import {asyncHandler} from "../utils/async-handler.js"
import {ApiErrors} from "../utils/apiErrors.js"
import {ApiResponse} from "../utils/apiResponse.js" 
import mongoose from "mongoose" 
import { UserRolesEnum } from "../utils/constants.js"

const create = asyncHandler(async (req ,res)=>{
    const { name , description } = req.body 

    const project = await Project.create({
        name,
        description ,
        createdBy : new mongoose.Types.ObjectId(req.user.id) 

    })

    await ProjectMember.create({
        user : new mongoose.Types.ObjectId(req.user.id), 
        project: new mongoose.Types.ObjectId(req.user.id),
        role: UserRolesEnum.ADMIN

    })

    return res
            .status(200)
            .json(new ApiResponse(200 , project ,"Project is created successfully"))

}) 

const updateProject = asyncHandler(async(req ,res)=>{
    const {name , description} = req.body 
    const {projectId} = req.params 

    const project = await Project.findByIdAndUpdate(
        projectId ,
        {name , 
            description
        },
        {new:true}
        
    )
    if(!project){
        throw new ApiError(404 , "Project not found")
    }

    return res  
            .status(200) 
            .json(new ApiResponse(200 , project , "Project has been updated successfully"))

})

const deleteProject = asyncHandler(async(req, res)=>{
    const {projectId} = req.params 

    const project = await Project.findByIdAndDelete(
        projectId
    )

    if(!project){
        throw new ApiError(404 , "Project not found")
    }
    return res  
            .status(200) 
            .json(new ApiResponse(200 , project , "Project has been deleted successfully"))
})