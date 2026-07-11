import express from "express" 
import cors from "cors" ; 
const app = express() ; 
// basic configuration ; 
app.use(express.json({limit:"16kb"})) ; 
app.use(express.urlencoded({extended:true , limit : "16kb"})) ;
app.use(express.static("public")) ; 
 
//cors configuration it takes a configurable  object as an argument
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials:true ,
    methods:["GET" , "POST" , "PUT" , "PATCH" , "DELETE" ,"OPTIONS"] , 
    allowedHeaders:["CONTENT_TYPE" , "AUTHORIZATION"]
    
})) ; 

app.get("/" , (req , res)=>{
    res.send("Welcome to Basecampy") ;
})

import healthCheckRouter from "./routes/healthcheck.routes.js" ; 
app.use("/api/v1/healthcheck" , healthCheckRouter) ;

app.get("/instagram" , (req, res)=>{
    res.send("this is the instagram page babe ") ;
})

export default app ;  

