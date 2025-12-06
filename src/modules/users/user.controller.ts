import { Request, Response } from "express";
import { successResponse, errorResponse } from "../../utils/response";
import { checkUserActiveBookings, deleteUserFromDB, getAllUsersFromDB, getUserByIdFromDB, updateUserInDB } from "./user.service";

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersFromDB();

    if (users.length === 0) {
      return res.status(200).json(
        successResponse("No users found", [])
      );
    }

    return res.status(200).json(
      successResponse("Users retrieved successfully", users)
    );

  } catch (err: any) {
    return res.status(500).json(
      errorResponse("Something went wrong", err.message)
    );
  }
};


export const updateUserController = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json(errorResponse("Invalid user ID", "ID must be a number"));
    }

    const existingUser = await getUserByIdFromDB(userId);
    if (!existingUser) {
      return res.status(404).json(errorResponse("User not found", "Not Found"));
    }

    const requester = req.user; // From middleware

    // ---------------- Permission Logic ----------------
    if (requester?.role !== "admin" && requester?.id !== userId) {
      return res.status(403).json(
        errorResponse("Forbidden: insufficient permissions", "Only admin or the user can update profile")
      );
    }

    const { name, email, phone, role } = req.body;

    const updates: Record<string, any> = {};

    if (name) updates.name = name;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;

    // Role change allowed only for admin
    if (role) {
      if (requester?.role !== "admin") {
        return res.status(403).json(errorResponse("Forbidden", "Only admin can change role"));
      }
      updates.role = role;
    }

    const updatedUser = await updateUserInDB(userId, updates);

    return res.status(200).json(
      successResponse("User updated successfully", updatedUser)
    );

  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(409).json(errorResponse("Email already exists", "Duplicate email"));
    }

    return res.status(500).json(errorResponse("Something went wrong", err.message));
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.userId);

    if (isNaN(id)) {
      return res.status(400).json(
        errorResponse("Invalid user ID", "ID must be a number")
      );
    }

    // Check user exists
    const existing = await getUserByIdFromDB(id);

    if (!existing) {
      return res.status(404).json(
        errorResponse("User not found", "Not Found")
      );
    }

    // Check active bookings
    const hasActive = await checkUserActiveBookings(id);

    if (hasActive) {
      return res.status(400).json(
        errorResponse(
          "User cannot be deleted because they have active bookings",
          "Active bookings exist"
        )
      );
    }

    // Delete user
    const deleted = await deleteUserFromDB(id);

    if (!deleted) {
      return res.status(500).json(
        errorResponse("Failed to delete user", "Unknown error")
      );
    }

    // Assignment EXACT RESPONSE
    return res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (err: any) {
    return res.status(500).json(
      errorResponse("Something went wrong", err.message)
    );
  }
};