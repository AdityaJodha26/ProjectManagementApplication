import {User} from "../models/users.models.js" 
import {Project} from "../models/project.models.js"
import {ProjectMember} from "../models/projectmember.models.js"
import {asyncHandler} from "../utils/async-handler.js"
import {ApiErrors} from "../utils/apiErrors.js"
import {ApiResponse} from "../utils/apiResponse.js" 
import mongoose from "mongoose" 
import { UserRolesEnum } from "../utils/constants.js"
import {Task} from "../models/task.models.js" 
import {Task} from "../models/subtask.models.js"
import { ResultWithContextImpl } from "express-validator/lib/chain/context-runner-impl.js"

const getTask = asyncHandler(async(req , res)=>{})


const createTask = asyncHandler(async(req , res)=>{
    const {title ,description , assignedTo , status} = req.body ; 
    const {projectId} = req.params
    const project = await Project.findOne(projectId)
    if(!project){
        throw new ApiErrors(400 , "Project not found")

    }
    const files = req.files || [];
    const attachments = files.map((file)=>{
        return {
            url:  `${process.env.SERVER_URL}/images/${file.originalname}`,
            mimetype: file.mimetype , 
            size:file.size,
        }
    })

    const task = await Task.create({
        title ,
        description ,
        project : new mongoose.Types.ObjectId(projectId) , 
        assignedTo :assignedTo ? new mongoose.Types.ObjectId(assignedTo) : undefined ,
        status , 
        assignedBy : new mongoose.Types.ObjectId(req.user._id) 
    })
});
const getTaskById = asyncHandler(async(req , res)=>{})
const updateTask = asyncHandler(async(req , res)=>{})
const deleteTask = asyncHandler(async(req , res)=>{})
const  createSubTask = asyncHandler(async(req , res)=>{})
const updateSubTask = asyncHandler(async(req , res)=>{})
const deleteSubTask = asyncHandler(async(req , res)=>{})

export {getTask , createTask , getTaskById ,updateTask ,deleteTask , createSubTask , updateSubTask ,deleteSubTask}