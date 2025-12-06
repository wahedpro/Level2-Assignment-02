import { Request, Response } from "express";
import { successResponse, errorResponse } from "../../utils/response";
import { checkActiveBookings, createVehicleIntoDB, deleteVehicleFromDB, getAllVehiclesFromDB, getVehicleByIdFromDB, updateVehicleInDB } from "./vehicle.service";

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

export const getAllVehiclesController = async (req: Request, res: Response) => {
  try {
    const vehicles = await getAllVehiclesFromDB();

    if (vehicles.length === 0) {
      return res.status(200).json(
        successResponse("No vehicles found", [])
      );
    }

    return res.status(200).json(
      successResponse("Vehicles retrieved successfully", vehicles)
    );
  } catch (err: any) {
    return res.status(500).json(
      errorResponse("Something went wrong", err.message)
    );
  }
};

export const getVehicleByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.vehicleId);

    if (isNaN(id)) {
      return res.status(400).json(
        errorResponse("Invalid vehicle ID", "ID must be a number")
      );
    }

    const vehicle = await getVehicleByIdFromDB(id);

    if (!vehicle) {
      return res.status(404).json(
        errorResponse("Vehicle not found", "Not Found")
      );
    }

    return res.status(200).json(
      successResponse("Vehicle retrieved successfully", vehicle)
    );
  } catch (err: any) {
    return res.status(500).json(
      errorResponse("Something went wrong", err.message)
    );
  }
};


export const updateVehicleController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.vehicleId);

    if (isNaN(id)) {
      return res.status(400).json(
        errorResponse("Invalid vehicle ID", "ID must be a number")
      );
    }

    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;

    const payload: Record<string, any> = {};

    if (vehicle_name) payload.vehicle_name = vehicle_name;
    if (type) payload.type = type;
    if (registration_number) payload.registration_number = registration_number;
    if (daily_rent_price !== undefined) payload.daily_rent_price = Number(daily_rent_price);
    if (availability_status) payload.availability_status = availability_status;

    const updated = await updateVehicleInDB(id, payload);

    if (!updated) {
      return res.status(404).json(
        errorResponse("Vehicle not found", "Not Found")
      );
    }

    return res.status(200).json(
      successResponse("Vehicle updated successfully", updated)
    );

  } catch (err: any) {
    if (err.code === "23505") {
      return res
        .status(409)
        .json(errorResponse("Registration number already exists", "Duplicate registration_number"));
    }

    return res.status(500).json(
      errorResponse("Something went wrong", err.message)
    );
  }
};

export const deleteVehicleController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.vehicleId);

    if (isNaN(id)) {
      return res
        .status(400)
        .json(errorResponse("Invalid vehicle ID", "ID must be a number"));
    }

    // Check for active bookings
    const hasActiveBookings = await checkActiveBookings(id);

    if (hasActiveBookings) {
      return res.status(400).json(
        errorResponse(
          "Vehicle cannot be deleted because it has active bookings",
          "Active bookings exist"
        )
      );
    }

    const deleted = await deleteVehicleFromDB(id);

    if (!deleted) {
      return res
        .status(404)
        .json(errorResponse("Vehicle not found", "Not Found"));
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully"
    });


  } catch (err: any) {
    return res
      .status(500)
      .json(errorResponse("Something went wrong", err.message));
  }
};
