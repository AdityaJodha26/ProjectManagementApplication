import {User} from "../models/users.models.js" 
import {Project} from "../models/project.models.js"
import {ProjectMember} from "../models/projectmember.models.js"
import {asyncHandler} from "../utils/async-handler.js"
import {ApiErrors} from "../utils/apiErrors.js"
import {ApiResponse} from "../utils/apiResponse.js" 
import mongoose from "mongoose" 
import { UserRolesEnum } from "../utils/constants.js"

const getProject = asyncHandler(async(req ,res)=>{

    const project = await ProjectMember.aggregate([
        {
            $match:{
                user: new mongoose.Types.ObjectId(req.user.id)

            }
        }
        ,
        {
            $lookup:{
                from:"project",
                localfield:"project",
                foreignfield:"id" , 
                as:"projects",
                pipeline:[
                    {
                        $lookup:{
                            from:"projectmembers" , 
                            localfield:"id",
                            foreignfield:projects ,
                            as:"projectmembers"
                        }
                    },
                    {
                        $addfields:{
                            members:{
                                $size:"$projectMembers"}
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$project"
        }
        ,{
            $project:{
                project:{
                    id:1 , 
                    name:1 , 
                    description:1 , 
                    member: 1 , 
                    createdBy:1 , 
                    createdAt: 1 , 
                }
                , 
                role:1 , 
                id:0
            }
        }
    ])

    return res
            .status(200) 
            .json(new ApiResponse(200 , project , "projects fetched successfully"))
})

const getProjectById = asyncHandler(async (req, res)=>{
    
    const {projectId} = req.params 
    const project = await Project.findById(
        projectId
    )
    if(!project) {
        throw new ApiErrors(400 ,"Project not found")
    }
    
    return res  
            .status(200 , new ApiResponse(200 , project , "Project founded successfully"))
})
const createProject = asyncHandler(async (req ,res)=>{
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

const addMemberToTheProject = asyncHandler(async(req, res)=>{

    const {email , role} = req.body ; 
    const {projectId} = req.params ; 

    const user = await User.findOne(email)
    if(!user){
        throw new ApiError(200 , "User not found")

    }
    
    await ProjectMember.findByIdAndUpdate(
        {
            user: new mongoose.Types.ObjectId(user.id) ,
            project: new mongoose.Types.ObjectId(project.id)
        },
         {
            user: new mongoose.Types.ObjectId(user.id) ,
            project: new mongoose.Types.ObjectId(project.id),
            role: role , 
        },
        {
            new :true , 
            upsert: true , 
        }
    )
    return res
            .status(200)
            .json(new ApiResponse(200 , {} , "user added successfully"))

})

const getProjectMembers = asyncHandler(async(req , res)=>{
    const {projectId} = req.params ; 

    const project = await Project.findById(projectid) 

    if(!project){
        throw new ApiError(200 , "project not found")
    }

    const projectMember = await ProjectMember.aggregate([
        {
            $match:{
                project: new mongoose.Types.ObjectId(projectId),
            }
                                      
        },
        {
            $lookup:{
                from : "users",
                localfield: "users" ,

                foreignfield: "id" ,
                as:"user" ,
                pipeline:[
                    {
                        $projects:{
                            id:1 ,
                            username:1 , 
                            fullname: 1 , 
                            avatar: 1 
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                users:{
                    $arrayElements:["$user" , 0]
                }
            }
        }
        ,
        {
            $project:{
                project : 1 ,
                user: 1 ,
                role : 1 ,
                createdAt : 1 ,
                updatedAt : 1 ,
                id: 0
            }
        }
    ])

    return res
            .status(200) 
            .json(new ApiResponse(200 , projectMember , " Project Member successfully fetched"))
})

const updateRole = asyncHandler(async (req, res)=>{

    const {projectId , userId} = req.params
    const {newRole} = req.body 

    if(!AvailableUserRole.includes(role)){
        throw new ApiError(400 , "Role is not defined")
    }

    let projectMember = await ProjectMember.findOne({
        project: new mongoose.Types.ObjectId(projectId) ,
        user: new mongoose.Types.ObjectId(userId) ,
    })

    if(!projectMember){
        throw new ApiError(200 , "Project Member not found")
    }

    projectMember = await ProjectMember.findByIdAndUpdate(
        projectMember.id,
        {
            role: newRole , 
        },
        {
            new:true , 
        }
    )
    if(!projectMember){
        throw new ApiError(200 , "Project Member not found")
    }

    return res
            .status(200) 
            .json( new ApiResponse(200 , projectMember , "Role updated"))
    

})

const deleteMember = asyncHandler(async(req,res)=>{
    const {projectId, userId} = req.params 
    
    const projectMember = await ProjectMember.findByIdAndDelete(
       { project: new mongoose.Types.ObjectId(projectId) ,
        user: new mongoose.Types.ObjectId(userId)
    })

    if(!projectMember){
        throw newApiError(400 , "Project Member not found") 

    }
    return res
            .status(200)
            .json(new ApiResponse(200 ,projectMember, "ProjectMember deleted"))
    
})
export {getProject , getProjectById , deleteMember , updateProject ,updateRole , createProject , addMemberToTheProject ,deleteProject , getProjectMembers }