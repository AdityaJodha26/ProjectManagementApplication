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
export {userRegisterValidator, userLoginValidator} ; 