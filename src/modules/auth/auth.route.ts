import { Router } from "express";
import { loginUser, registerUser } from "./auth.controller";

const router = Router();

router.post("/signup", registerUser);
router.post("/signin", loginUser);


export const authRouter = router;