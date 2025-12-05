import express, {Request, Response } from "express";
import { initDB } from "./database/db";
import { authRouter} from "./modules/auth/auth.route";

const app = express();
app.use(express.json());

initDB();

app.use("/api/v1/auth", authRouter);

app.get("/",(req : Request, res : Response)=>{
    res.status(200).json({
        message: "This is the root API"
    })
})

app.listen(5000,()=>{
    console.log("Vehicle Rental System Server is Running")
})