import { Router } from "express";
import { authMiddleware, permitAdmin } from "../../middlewares/auth.middleware";
import { createVehicleController } from "./vehicle.controller";

const router = Router();

// Admin only can create vehicle
router.post("/", authMiddleware, permitAdmin, createVehicleController);

export const vehiclesRouter = router;
