import {User} from "../models/users.models.js" ;
import {ApiResponse} from "../utils/apiResponse.js" ; 
import {ApiErrors} from "../utils/apiErrors.js" ; 
import {asyncHandler} from "../utils/async-handler.js" ; 
import {sendEmail} from "../utils/mail.js" ; 
const generateAccessAndRefreshTokens = async (userId) => {
    try{
        const user = await User.findById(userId) ;
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken ;
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
    const {unHashedToken , HashedToken , tokenExpiry } = user.generateTemporaryToken() ; 
    
    const unhashedToken = unHashedToken || unHashedToken === undefined ? unHashedToken : undefined;
    const hashedToken = HashedToken || HashedToken === undefined ? HashedToken : undefined;

    // Prefer common lowercased variable names if provided by the model method
    const _unhashed = unhashedToken ?? (typeof unhashedToken === 'string' ? unhashedToken : undefined);
    const _hashed = hashedToken ?? (typeof hashedToken === 'string' ? hashedToken : undefined);

    // assign tokens if available
    if (_hashed) user.emailVerificationToken = _hashed;
    if (tokenExpiry) user.emailVerificationExpiry = tokenExpiry ; 

    await user.save({validateBeforeSave : false}) 

    await sendEmail({
        email: user?.email,
        subject:"please verify the email ",
        mailgenContent : emailVerificationMailgenContent(
            user.username , 
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${_unhashed || unhashedToken}` ,
            
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


