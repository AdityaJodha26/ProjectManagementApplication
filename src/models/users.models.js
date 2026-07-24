import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto" ; 
import jwt from "jsonwebtoken" ;

import { JsonWebTokenError } from "jsonwebtoken";
const userSchema = new Schema(
    { avatar: {
        type:{
            url: String , 
            localPath: String ,
        },
        default:{
            url:`https://www.istockphoto.com/illustrations/default-user-icon`,
            localPath: String , 
        }

    },
    user:{
        type: String , 
        required: true , 
        unique:true , 
        lowercase: true , 
        trim: true ,
        index: true , 
    },
    email:{
        type: String , 
        required: true , 
        unique:true , 
        lowercase: true , 
        trim: true ,
        index: true , 
    },
    fullname: {
        type: String , 
        trim: true ,
    },
    password: {
        type: String , 
        required: [true , "Password is required"] ,

    },
    isEmailVerified : {
        type: Boolean ,
        default: false , 

    },
    refreshToken:{
        type:String 
    },
    forgetPasswordToken:{
        type:String , 
    },
    forgetPasswordExpiry:{
        type: Date , 
    },
    emailVerificationToken:{
        type:String , 

    }, 
    emailVerificationExpiry:{
        type:Date , 
    }

    },
    {
        timestamps: true ,
    })

userSchema.pre("save" , async function(next) {
    if(!this.isModified("password")) return next() ;
    this.password = await bcrypt.hash(this.password , 10) ; 
    next() ; 
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password , this.password) ; 
    
};
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id ,
            email:this.email ,
            username: this.username 
        },
        process.env.ACCESS_TOKEN_SECRET , 
        {expiry: process.env.ACCESS_TOKEN_EXPIRY}
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        { _id : this._id , 
        } ,
        process.env.REFRESH_TOKEN_SECRET , 
        {expiryIn: process.env.REFRESH_TOKEN_EXPIRY}
        
        
)
}

userSchema.methods.generateTemporaryToken = function(){
    const unHashedToken = crypto.randomBytes(20).toString("hex") ;
    const HashedToken = crypto.hash("sha256").update(unHashedToken).digest("hex"); 
    const tokenExpiry = Date.now() + (20*60*1000) ; 
    return {unHashedToken , HashedToken , tokenExpiry} ; 
}

export const User = mongoose.model("User" ,userSchema) ;
