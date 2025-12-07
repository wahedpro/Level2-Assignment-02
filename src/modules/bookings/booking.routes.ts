import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createBookingController, getAllBookingsController, updateBookingController } from "./booking.controller";

const router = Router();

router.post("/", authMiddleware, createBookingController);
router.get("/", authMiddleware, getAllBookingsController);
router.put("/:bookingId", authMiddleware, updateBookingController);

export const bookingsRouter = router;
