import mongoose, { Schema } from "mongoose" 
import { AvailableTaskStatuses , TaskStatusEnum } from "../utils/constants.js" 

const subTask = new Schema({
    title:{
        type : String , 
        trim: true , 
        required: true , 
    }
    , 
    task:{
        type: Schema.Types.ObjectId , 
        ref: "Task" , 
        required: true 
    } ,
    isCompleted:{
        type:Boolean , 
        default : false , 
    } ,
    createdBy:{
        type: Schema.Types.ObjectId , 
        ref: "Task" , 
        required: true ,
    }
} , {timestamps:true})

export const SubTask = mongoose.model("Subtask" , subTask)