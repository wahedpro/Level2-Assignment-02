import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createBookingController } from "./booking.controller";

const router = Router();

router.post("/", authMiddleware, createBookingController);

export const bookingsRouter = router;
