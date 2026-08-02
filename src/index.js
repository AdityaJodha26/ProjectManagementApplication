import dotenv from "dotenv" 
dotenv.config({
    path: "./.env" ,
}) ; 
import app from "./app.js" 
import connectDB from "./db/databaseCnFl.js";
 


const port = process.env.port || 3000 ; 
app.get("/" , (req , res)=>{
    res.send("HEllo WORld") ;
})

app.get("/instagram" , (req, res)=>{
    res.send("this is the instagram page babe ") ;
})
connectDB()
.then(()=>{
    app.listen(port , ()=>{
    console.log(`Example app is listening on the port http://localhost:${port}`)
    })
})
.catch((err)=>{
    console.error("MongoDB connection error" , err) ;
    process.exit(1) ; 
})


