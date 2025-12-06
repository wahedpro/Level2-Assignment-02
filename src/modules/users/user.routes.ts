import { Router } from "express";
import { authMiddleware, permitAdmin } from "../../middlewares/auth.middleware";
import { getAllUsersController } from "./user.controller";

const router = Router();

router.get("/", authMiddleware, permitAdmin, getAllUsersController);

export const usersRouter = router;