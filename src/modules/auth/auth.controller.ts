import { Request, Response } from "express";
import { successResponse, errorResponse } from "../../utils/response";
import { authServices } from "./auth.service";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Basic validation
    if (!name || !email || !password || !phone) {
      return res.status(400).json(
        errorResponse(
          "All fields are required",
          "Missing required fields"
        )
      );
    }

    if (password.length < 6) {
      return res.status(400).json(
        errorResponse("Password must be at least 6 characters", "Weak password")
      );
    }

    // Create user
    const user = await authServices.createUserIntoDB({
      name,
      email,
      password,
      phone,
      role: role || "customer",
    });

    // Success response
    return res.status(201).json(
      successResponse("User registered successfully", user)
    );
  } catch (error: any) {
    // Unique email error
    if (error.code === "23505") {
      return res.status(409).json(
        errorResponse("Email already exists", "Duplicate email")
      );
    }

    return res.status(500).json(
      errorResponse("Something went wrong", error.message)
    );
  }
};
