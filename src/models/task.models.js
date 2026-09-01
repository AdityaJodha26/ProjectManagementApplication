import mongoose, { Schema } from "mongoose" ;
import { AvailableTaskStatuses, TaskStatusEnum  } from "../utils/constants";

const task = new Schema({
    title :{
        type:String , 
        required: true , 
        unique: true , 
        trim : true , 
    }
    ,
    description: String , 
    project:{
        type: Schema.Types.ObjectId , 
        ref: "Project" ,  
        required: true
    }
     , 
    assignedTo :{
        type: Schema.Types.ObjectId ,
        ref: "User" ,  
    } , 
    assignedBy : {
        type:Schema.Types.ObjectId ,
        ref : "User"
    }
    ,
    status:{
        type:String , 
        enum:AvailableTaskStatuses , 
        default: TaskStatusEnum  ,

    },
    attachments:{
        type:[{
            url: String , 
            mimetype:String , 
            size : Number ,
        }], 
        default:[]
    }
} , {timestamps:true})

export const Task = mongoose.model("Task" , task) ;