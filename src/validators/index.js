import {body} from "express-validator" ;

const userRegisterValidator = ()=>{
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("email cannot be empty") 
        .isEmail()
        .withMessage("email is not valid"),
        
        body("username")
        .trim()
        .notEmpty()
        .withMessage("username must not empty")
        .isLowercase()
        .withMessage("it must be in lowercase")
        .isLength({min: 3})
        .withMessage("it should be atleast 3characterlong"),

        body("password")
        .trim()
        .notEmpty()
        .withMessage("it should not be empty"),
        
        body("fullname")
        .trim()
        .optional()
         

    ]
}
const userLoginValidator = ()=>{
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("email is required")

        ,
        body("password")
        .trim()
        .notEmpty()
        .withMessage("password is required")
        
    ]
}

const userChangeCurrentPasswordValidator = () =>{
    return []
        body("oldPassword").notEmpty().withMessage("Old Password is required") 
        ,
        body("newPassword").notEmpty().withMessage("New Password is required")


}

const userForgotPasswordValidator = ()=>{
    return[
        body("email")
            .notEmpty()
            .withMessage("Email is Required")
            .isEmail()
            .withMessage("Email is invalid")
    ]
}

const userResetForgotPasswordValidator = ()=>{
    return [
        body("newPassword")
            .notEmpty()
            .withMessage("Password is required")
    ]
}
export {userRegisterValidator, userLoginValidator} ; 