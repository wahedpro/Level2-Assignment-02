import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createBookingController, getAllBookingsController } from "./booking.controller";

const router = Router();

router.post("/", authMiddleware, createBookingController);
router.get("/", authMiddleware, getAllBookingsController);

export const bookingsRouter = router;
