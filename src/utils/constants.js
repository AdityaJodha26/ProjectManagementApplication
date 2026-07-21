export const UserRolesEnum = {
    ADMIN : "admin" ,
    PROJECT_ADMIN : "project_admin" , 
    MEMBER : "member" ,
}
export const AvailableUserRole = Object.values(UserRolesEnum) ; // role{enum:AvailableUserRole}

export const TaskStatusEnum = {
    TODO : "todo " , 
    IN_PROGRESS: "in_progress" ,
    DONE : "done"

}

export const AvailableTaskStatues = Object.values(TaskStatusEnum) ;