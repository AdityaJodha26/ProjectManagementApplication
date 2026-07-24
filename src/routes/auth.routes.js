import { Router } from "express"
import {} from "../controllers/auth.controllers.js"

const router = Router() ;

router.route("/register").post(registerUser) ; 

export default router ; 