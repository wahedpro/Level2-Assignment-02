import express, { Request, Response } from "express";

const app = express();

app.get("/",(req : Request, res : Response)=>{
    res.status(200).json({
        message: "This is the root API"
    })
})

app.listen(5000,()=>{
    console.log("Vehicle Rental System Server is Running")
})