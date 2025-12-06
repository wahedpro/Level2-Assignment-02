import { Router } from "express";
import { authMiddleware, permitAdmin } from "../../middlewares/auth.middleware";
import { createVehicleController, getAllVehiclesController } from "./vehicle.controller";

const router = Router();

// Admin only can create vehicle
router.post("/", authMiddleware, permitAdmin, createVehicleController);

// Public
router.get("/", getAllVehiclesController);


export const vehiclesRouter = router;
