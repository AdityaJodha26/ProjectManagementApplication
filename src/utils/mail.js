import mailgen from "mailgen" ; 
import nodemailer from "nodemailer" ;

const sendEmail = async(options) =>{
    const mailGenerator = new Mailgen({
        theme:"default" ,
        product: {
            name:"task manager" ,
            link:"https://taskmanagerlink.com" 
        }
    })
    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent) ;
    const emailHTML = mailGenerator.generate(options.mailgenContent) ; 
    nodemailer.createTransport({
        host:process.env.MAILGEN_SMTP_HOST ,
        port:process.env.MAILGEN_SMTP_PORT ,
        auth:{
            user:process.env.MAILGEN_SMTP_USERNAME ,
            password:process.env.MAILGEN_SMTP_PASSWORD,
        }
    })
    const mail ={
        from:"mail.taskmanager@example.com" ,
        to: options.email, 
        subject: options.subject ,
        text : emailTextual,
        html :emailHTML , 

    }
    try{
        await transporter.sendEmail(mail) ;

    }catch(error){ 
        console.error("na")
        console.log("error" , error); 

    }
}

const emailVerificationMailGenContent = (username , emailVerificationUrl)=>{
    return {
        body:{
            name:username , 
            intro: "this is the email for verification " , 
            action:{
                instruction:" to verify your email click on the below button"  , 
                button:{
                    text: "Verify Your Email" , 
                    color: "#22bc65" ,
                    link: emailVerificationUrl 
                
                },
            },
            outros: "verify ho gaye ji  "

        }
    }
}
const forgotEmailMailGenContent = (username , forgotEmailUrl)=>{
    return {
        body:{
            name:username , 
            intro: "We get a request to reset your password" , 
            action:{
                instruction:" to reset your password click on the below button "  , 
                button:{
                    text: "forgot password " , 
                    color: "#22bc65" ,
                    link: forgotEmailUrl 
                
                },
            },
            outros: "password mat bhulna samjha n "

        }   
    }
}

export {emailVerificationMailGenContent , forgotEmailMailGenContent ,sendEmail} 
     

