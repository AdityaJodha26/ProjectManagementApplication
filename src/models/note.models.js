import mongoose, { Schema } from "mongoose" ; 

const projectNote = new Schema({
    project:{
        type:Schema.Types.ObjectId , 
        ref : "Project", 
        required: true , 
    }
    , 
    CreatedBy: {
        type: Schema.Types.ObjectId , 
        ref: "User" , 
        required: true  
    }
    , 
    content : {
        type : String , 
        required: true
    }
} ,{ timestamps: true})

export const ProjectNote = mongoose.model("ProjectNote",projectNote) ; 
