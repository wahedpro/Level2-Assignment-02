import { Router } from "express";
import { authMiddleware, permitAdmin } from "../../middlewares/auth.middleware";
import { deleteUserController, getAllUsersController, updateUserController } from "./user.controller";

const router = Router();

// get all the users
router.get("/", authMiddleware, permitAdmin, getAllUsersController);
// update user 
router.put("/:userId", authMiddleware, updateUserController);
// user delete
router.delete("/:userId", authMiddleware, permitAdmin, deleteUserController);

export const usersRouter = router;