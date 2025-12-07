import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../utils/response";
import { 
  getVehicleById, 
  createBookingInDB, 
  updateVehicleStatus, 
  getBookingsByCustomerDB,
  getAllBookingsAdminDB
} from "./booking.service";

export const createBookingController = async (req: Request, res: Response) => {
  try {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;

    if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
      return res.status(400).json(
        errorResponse("All fields are required", "Missing required fields")
      );
    }

    const vehicle = await getVehicleById(vehicle_id);

    if (!vehicle) {
      return res.status(404).json(
        errorResponse("Vehicle not found", "Invalid vehicle")
      );
    }

    if (vehicle.availability_status !== "available") {
      return res.status(400).json(
        errorResponse("Vehicle is not available", "Already booked")
      );
    }

    // Calculate number of days
    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);
    const diffMs = end.getTime() - start.getTime();

    if (diffMs <= 0) {
      return res.status(400).json(
        errorResponse("Invalid date range", "rent_end_date must be later than rent_start_date")
      );
    }

    const number_of_days = diffMs / (1000 * 60 * 60 * 24);
    const total_price = Number(vehicle.daily_rent_price) * number_of_days;

    // Create booking
    const booking = await createBookingInDB({
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status: "active"
    });

    // Update vehicle → booked
    await updateVehicleStatus(vehicle_id, "booked");

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        ...booking,
        vehicle: {
          vehicle_name: vehicle.vehicle_name,
          daily_rent_price: vehicle.daily_rent_price
        }
      }
    });

  } catch (err: any) {
    return res.status(500).json(
      errorResponse("Something went wrong", err.message)
    );
  }
};

export const getAllBookingsController = async (req: Request, res: Response) => {
  try {
    const user = req.user; // logged-in user

    // ---------------- Admin View ----------------
    if (user?.role === "admin") {
      const rows = await getAllBookingsAdminDB();

      const formatted = rows.map((b) => ({
        id: b.id,
        customer_id: b.customer_id,
        vehicle_id: b.vehicle_id,
        rent_start_date: b.rent_start_date,
        rent_end_date: b.rent_end_date,
        total_price: b.total_price,
        status: b.status,
        customer: {
          name: b.customer_name,
          email: b.customer_email,
        },
        vehicle: {
          vehicle_name: b.vehicle_name,
          registration_number: b.registration_number,
        }
      }));

      return res.status(200).json(
        successResponse("Bookings retrieved successfully", formatted)
      );
    }

    // ---------------- Customer View ----------------
    const rows = await getBookingsByCustomerDB(user!.id);

    const formatted = rows.map((b) => ({
      id: b.id,
      vehicle_id: b.vehicle_id,
      rent_start_date: b.rent_start_date,
      rent_end_date: b.rent_end_date,
      total_price: b.total_price,
      status: b.status,
      vehicle: {
        vehicle_name: b.vehicle_name,
        registration_number: b.registration_number,
        type: b.type
      }
    }));

    return res.status(200).json(
      successResponse("Your bookings retrieved successfully", formatted)
    );

  } catch (err: any) {
    return res.status(500).json(
      errorResponse("Something went wrong", err.message)
    );
  }
};