import express, {Request, Response } from "express";
import { initDB } from "./database/db";
import { authRouter} from "./modules/auth/auth.route";
import { vehiclesRouter } from "./modules/vehicles/vehicle.routes";
import { usersRouter } from "./modules/users/user.routes";

const app = express();
app.use(express.json());

initDB();

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vehicles", vehiclesRouter);
app.use("/api/v1/users", usersRouter);

app.get("/",(req : Request, res : Response)=>{
    res.status(200).json({
        message: "This is the root API"
    })
})

app.listen(5000,()=>{
    console.log("Vehicle Rental System Server is Running")
})