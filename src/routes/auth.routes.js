import { Router } from "express"
import {forgotPassword, refreshAccessToken, registerUser, resendEmailVerification, resetPassword, verifyEmail} from "../controllers/auth.controllers.js"
import { login } from "../controllers/auth.controllers.js";
import { userRegisterValidator, userLoginValidator ,userChangeCurrentPasswordValidator ,userForgotPasswordValidator   } from "../validators/index.js";
import { validate } from "../middleware/validator.middleware.js";


const router = Router() ;

//UnsecureRoute
router.route("/register").post(userRegisterValidator(), validate , registerUser) ; 
router.route("/login").post(userLoginValidator() , validate , login) ; 
router.route("/verify-email:verificationToken")
        .get(verifyEmail) ; 
router
    .route("/refresh-token")
    .post(refreshAccessToken)

router
    .route("/forgot-password")
    .post(userForgotPasswordValidator() , validate , forgotPassword)

router
    .route("/reset-password/:resetToken")
    .post( resetPassword)

//secureRoute
router.route("/logout").post(verifyJWT , logout)
router.route("/current0-user").post(verifyJWT , userChangeCurrentPasswordValidator() ,validate , changeCurrentPassword)
router.route("/resend-email-verification").post(verifyJWT , resendEmailVerification)







export default router ;
 