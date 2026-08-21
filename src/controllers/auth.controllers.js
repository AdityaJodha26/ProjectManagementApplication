import {User} from "../models/users.models.js" ;
import {ApiResponse} from "../utils/apiResponse.js" ; 
import {ApiErrors} from "../utils/apiErrors.js" ; 
import {asyncHandler} from "../utils/async-handler.js" ; 
import {sendEmail ,emailVerificationMailGenContent} from "../utils/mail.js" ; 
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

    const Login = asyncHandler(async(req, res ) =>{
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

        
        
    })
})
export {registerUser} 


