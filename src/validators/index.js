import {body} from "express-validator" ;

const userRegisterValidator = ()=>{
    return [
        body("email")
        .trim()
        .isEmpty()
        .withMessage("email cannot be empty") 
        .isEmail()
        .withMessage("email is not valid"),
        
        body("username")
        .trim()
        .isEmpty()
        .withMessage("")
    ]
}