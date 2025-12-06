import { Request, Response } from "express";
import { successResponse, errorResponse } from "../../utils/response";
import { createVehicleIntoDB } from "./vehicle.service";

const ALLOWED_TYPES = ["car", "bike", "van", "SUV"];
const ALLOWED_STATUS = ["available", "booked"];

export const createVehicleController = async (req: Request, res: Response) => {
  try {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;

    // -------- Validation ----------
    if (!vehicle_name || !type || !registration_number || daily_rent_price === undefined || !availability_status) {
      return res
        .status(400)
        .json(errorResponse("All fields are required", "Missing required fields"));
    }

    if (!ALLOWED_TYPES.includes(type)) {
      return res
        .status(400)
        .json(errorResponse("Invalid vehicle type", `Allowed: ${ALLOWED_TYPES.join(", ")}`));
    }

    if (!ALLOWED_STATUS.includes(availability_status)) {
      return res
        .status(400)
        .json(errorResponse("Invalid availability status", `Allowed: ${ALLOWED_STATUS.join(", ")}`));
    }

    const price = Number(daily_rent_price);
    if (Number.isNaN(price) || price <= 0) {
      return res
        .status(400)
        .json(errorResponse("daily_rent_price must be a positive number", "Invalid price"));
    }

    // ---------- Create Vehicle ----------
    const vehicle = await createVehicleIntoDB({
      vehicle_name,
      type,
      registration_number,
      daily_rent_price: price,
      availability_status,
    });

    return res
      .status(201)
      .json(successResponse("Vehicle created successfully", vehicle));

  } catch (err: any) {
    if (err.code === "23505") {
      return res
        .status(409)
        .json(errorResponse("Registration number already exists", "Duplicate registration_number"));
    }

    return res
      .status(500)
      .json(errorResponse("Something went wrong", err.message));
  }
};
