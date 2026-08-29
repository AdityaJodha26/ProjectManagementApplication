import {User} from "../models/users.models.js" ;
import {ApiResponse} from "../utils/apiResponse.js" ; 
import {ApiErrors} from "../utils/apiErrors.js" ; 
import {asyncHandler} from "../utils/async-handler.js" ; 
import {sendEmail ,emailVerificationMailGenContent, forgotEmailMailGenContent} from "../utils/mail.js" ; 
import jwt from "jsonwebtoken" ; 
const generateAccessAndRefreshTokens = async (userId) => {
    try{
        const user = await User.findById(userId) ;
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken ;  // saving the refresh token in the database
        await user.save({validateBeforeSave:false})
        return {accessToken , refreshToken} ; 
    }
    catch(err){
        throw new ApiErrors(500 ,"something went wrong while generating access token")

    }
}

const registerUser = asyncHandler( async (req , res ) => {
    const {email , username , password , role} = req.body
    
    const existedUser = await User.findOne({
        $or: [{ username }, { email }] 
    })

    if(existedUser){
        throw new ApiErrors(409 , "User already exist") ; 
    }

    const user = await User.create({
        email , 
        password ,
        username , 
        isEmailVerified : false
    })
    const {unhashedToken , hashedToken , tokenExpiry } = user.generateTemporaryToken() ; 
    
    
    

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;
    await user.save({validateBeforeSave : false}) 

    await sendEmail({
        email: user?.email,
        subject:"please verify the email ",
        mailgenContent : emailVerificationMailGenContent(
            user.username , 
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}` ,
            
        )

        

    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry");

    if(!createdUser){
        throw new ApiErrors(500 , "Something went wrong")
    }

    return res.status(201).json(
        new ApiResponse(
            201 , 
            {user: createdUser} ,
            "User registered successfully"
        )
    )

   
    
})
 const login = asyncHandler(async(req, res ) =>{
        const [email , username , password] = req.body
        if(!email){
            throw new ApiErrors(400 , "or email is required");
        }

        const user = await user.findOne({email})

        if(!user){
            throw new ApiErrors(400 , "User not found")
        }

        const isPasswordValid = await user.isPasswordCorrect(password) 
        
        if(!isPasswordValid){
            throw new ApiError(400 , "User is not found")

        }

        const {accessToken , refreshToken} = await generateAccessAndRefreshTokens(user.id) 

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry");

        const options = {
            httpOnly : true ,  // cookie requires options
            secure: true ,
        }

        return res
            .status(200)
            .cookie("accessToken" , accessToken ,options)
            .cookie("refreshToken" , refreshToken , options)
            .json(
                new ApiResponse(
                    200 , 
                    {
                        user: loggedInUser , accessToken , refreshToken
                    },
                    "User logged in successfully"
                )
            )

        
        
    })

const logout = asyncHandler(async(req, res)=>{
    await User.findByAndUpdate(
        req.user.id,
        { 
            $set : {
                refreshToken: "" , 
            }, 

        },
        {
            new:true , 
        },
    )

    const options = {
        httpOnly: true , 
        secure: true , 

    }

    return res
        .status(200) 
        .clearCookie("accessToken" , options)
        .clearCookie("refreshToken" , options)
        .json({
            success:true , 
            message: "User logged in successfully"
        })
})

const getCurrentUser = asyncHandler(async(req, res)=>{
    return res  
        .status(200)
        .json(new ApiResponse(200 , req.user , "Current User fetched Successfully"))

})

const verifyEmail = asyncHandler(async(req ,res)=>{
    const {verificationToken} = req.params
    if(!verificationToken){
        throw new ApiError(400 , "Email verification token is missing")

    }
    let hashedToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex")

        await User.findOne({
            emailVericationToken:hashedToken , 
            emailVerificationExpiry: {$gt: Date.now()}

        })
        if(!user){
            throw new ApiError(400 , "Token is invalid or expired")

        }

        emailVericationToken = undefined 
        emailVerificationExpiry = undefined

        user.isEmailVerified = true 
        await user.save({validateBeforeSave:false})

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200 ,
                    {
                        isEmailVerified : true 
                    } ,

                    "Email is Verified"
                )
            )

    
})

const resendEmailVerification = asyncHandler(async(req, res)=>{
    const user = await user.findOne(req.user?.id) ; 
    if(!user){
        throw new ApiError(404 , "User does not exist") ;
    }

    if(!user.isEmailVerified){
        throw new ApiError(404 , "User is already verified")

    }
    const {unhashedToken , hashedToken , tokenExpiry } = user.generateTemporaryToken() ; 
    
    
    

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;
    await user.save({validateBeforeSave : false}) 

    await sendEmail({
        email: user?.email,
        subject:"please verify the email ",
        mailgenContent : emailVerificationMailGenContent(
            user.username , 
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}` ,
            
        )

        

    })

    return res
        .status(200) 
        .json(200 , new ApiResponse(200 , {} , "mail has been sent to u again"))

})
const refreshAccessToken = asyncHandler( async(req, res)=>{
    const incomingRefreshToken = await req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(200 , "Unauthorized Access")
    }

    try{
        const decodedToken = jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET,);

        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401 , "Invalid refresh Token") 
        }
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401 , "Refresh token is expired") 
        }

        const options = {
            httpOnly: true ,
            secure : true 
        }

        const {accessToken , refreshToken: newRefreshToken} = await generateAccessAndRefreshTokens(user.id)

        user.refreshToken = newRefreshToken ;
        await user.save()

        return res  
                .status(200) 
                .cookie("accessToken" , accessToken ,options)
                .cookie("refreshToken" , newRefreshToken , options)
                .json(
                    new ApiResponse(200 , {accessToken , refreshToken : newRefreshToken} , "Access token refreshed")
                )
    }
    catch(error){

    }



})
const forgotPassword = asyncHandler(async (req, res)=>{
    const {email} =  req.body
    const user = await user.findOne({email})
    if(!user) {
        throw new ApiError()
    }

    const {unHashedToken , hashedToken , tokenExpiry } = generateTemporaryToken ; 

    user.forgotPasswordToken = hashedToken ; 
    user.forgotPasswordExpiry = tokenExpiry ; 

    await user.save({validateBeforeSave:false})

    await sendEmail({
        email:user.email ,
        subject: "Password Reset request" ,
        mailgenContent: forgotEmailMailGenContent(
            user.username , 
            `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}`,
        )
        
    })
    return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Password reset mail has been sent to you on your email id "

                    
                )
            )
});



const resetPassword = asyncHandler(async (req ,res)=>{

    const {resetToken} = req.params
    const {newPassword} = req.body 

    let hashedToken = crypto
        .createHash("sha256")
        .update(resetToken) 
        .digest("hex")

    const user = await User.findOne({
        forgotPasswordToken:hashedToken ,
        forgotPasswordExpiry:{$gt : Date.now()}

    })
    if(!user){
        throw new ApiError(489 , "Token is invalid or expired")

    }

    user.forgotPasswordExpiry = undefined 
    user.forgotPasswordToken = undefined 

    user.password = newPassword ; 
    await user.save({validateBeforeSave : false})

    return res
        .status(200) 
        .json(new ApiResponse(200 , "password Reset successfully"))
})

const changePassword = asyncHandler(async (req ,res)=>{

    const {oldPassword , newPassword} = req.body
    const user = await user.findOne(req.user?.id) ;

    const isPasswordValid = await user.isPasswordCorrect(oldPassword) 

    if(!isPasswordValid){
        throw new ApiError(400 , "Passsword is not valid")
    }

    user.password = newPassword ;
    await user.save({validateBeforeSave:false})

    return res
        .status(200 )
        .json(new ApiResponse(200 , {}, "Password changed Successfully"))


})

export {registerUser , login ,logout , getCurrentUser , verifyEmail ,resendEmailVerification ,  refreshAccessToken , forgotPassword , resetPassword , changePassword } 


