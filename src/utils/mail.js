import Mailgen from "mailgen" ; 
import nodemailer from "nodemailer" ;

const sendEmail = async(options) =>{ // options contains information such as email ,subject , mailgencontent
    const mailGenerator = new Mailgen({
        theme:"default" ,
        product: {
            name:"task manager" ,
            link:"https://taskmanagerlink.com" 
        }
    })
    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent) ;
    const emailHTML = mailGenerator.generate(options.mailgenContent) ; 
    const transporter = nodemailer.createTransport({
        host:process.env.MAILTRAP_SMTP_HOST ,
        port:process.env.MAILTRAP_SMTP_PORT ,
        auth:{
            user:process.env.MAILTRAP_SMTP_USERNAME ,
            pass:process.env.MAILTRAP_SMTP_PASSWORD,
        }
    })
    console.log({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    user: process.env.MAILTRAP_SMTP_USERNAME,
    passLoaded: !!process.env.MAILTRAP_SMTP_PASSWORD,
    });
    const mail ={
        from:"mail.taskmanager@example.com" ,
        to: options.email, 
        subject: options.subject ,
        text : emailTextual,
        html :emailHTML , 

    }
    try {
        const info = await transporter.sendMail(mail);

        console.log("Email sent successfully");
        console.log(info);
    } catch (error) {
        console.error("Email sending failed:");
        console.error(error);
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
     

