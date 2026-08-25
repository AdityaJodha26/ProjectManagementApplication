class ApiErrors
 extends Error {
    constructor(statusCode , message = "Something went Wrong" , errors=[] , stack="" )//given by error (stack trace))
        {
            super(message) 
            this.statusCode= statusCode ;
            this.data = null ; 
            this.message = message; 
            this.success = false ; 
            this.errors = errors ; 
            

            if(stack){
                this.stack = stack ; 
            }
            else{
                Error.captureStackTrace(this , this.constructor) 
            }

            // apierrors class extends the error class of js . so our class automatically gets properties and behavior from errors like message , name and stack .
            // Whenever you create using a subclass using extends its important to use super before using this 
            // super message calls the constructor of the parent class which is errors and it is used to initialize propertie of errors class . parent constructor to run before using this                

    }
}
export  {ApiErrors}