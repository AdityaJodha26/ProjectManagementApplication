import mongoose, { Schema } from "mongoose" ; 
import {AvailableUserRole , UserRolesEnum} from "../utils/constants.js"

const projectMember = new Schema({
    project:{
        type: Schema.Types.ObjectId ,
        ref : Project , 
        required: true , 
    },
    user:{
         type:Schema.Types.ObjectId,
         ref : User ,
         required: true ,

    },
    role:{
        type:String , 
        enum: AvailableRoleEnum , 
        default: UserRolesEnum.MEMBER , 
    }
} ,{timestamps: true })

export const ProjectMember = mongoose.model("ProjectModel" , projectMember) 