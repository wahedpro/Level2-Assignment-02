import { Router } from "express";
import { registerUser } from "./auth.controller";

const router = Router();

router.post("/signup", registerUser);

export const authRouter = router;