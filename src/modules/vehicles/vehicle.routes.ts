import { Router } from "express";
import { authMiddleware, permitAdmin } from "../../middlewares/auth.middleware";
import { createVehicleController, deleteVehicleController, getAllVehiclesController, getVehicleByIdController, updateVehicleController } from "./vehicle.controller";

const router = Router();

// create vehicle by Admin
router.post("/", authMiddleware, permitAdmin, createVehicleController);

// Get all the vehicle
router.get("/", getAllVehiclesController);

// get vehicle by ID
router.get("/:vehicleId", getVehicleByIdController);

// Update vehicle by Admin
router.put("/:vehicleId", authMiddleware, permitAdmin, updateVehicleController);

// Delete vehicle by admin
router.delete("/:vehicleId", authMiddleware, permitAdmin, deleteVehicleController);


export const vehiclesRouter = router;