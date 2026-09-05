import { Router } from "express"
import {getProject , getProjectById , deleteMember , updateProject ,updateRole , createProject , addMemberToTheProject ,deleteProject , getProjectMembers} from "../controllers/project.controllers.js"

import { createProjectValidator , addMemberToTheProjectValidator  } from "../validators/index.js";
import { validate } from "../middleware/validator.middleware.js";
import { verifyJWT , validateProjectPermission } from "../middleware/auth.middleware.js";
import { AvailableUserRole  , UserRolesEnum} from "../utils/constants.js";



const router = Router() ;
router.use(verifyJWT) 

router
    .route("/")
    .get(getProject)
    .post(createProjectValidator() , validate , createProject) 


router.route("/:projectId")
    .get(validateProjectPermission(AvailableUserRole) , getProjectById)
    .put(validateProjectPermission([UserRolesEnum.ADMIN]) , createProjectValidator() , validate , updateProject)
    .delete(validateProjectPermission([UserRolesEnum.ADMIN]) , deleteProject)


router.route("/:projectId/member")
    .get(getProjectMembers)
    .post(validateProjectPermission([UserRolesEnum.ADMIN]) , addMemberToTheProjectValidator() ,  validate , addMemberToTheProject )
    
router.route("/:project/member/:userId")
    .put(validateProjectPermission([UserRolesEnum.ADMIN]), updateRole)
    .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteMember) 
    
export default router 