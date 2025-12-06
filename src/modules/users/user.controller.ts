import { Request, Response } from "express";
import { successResponse, errorResponse } from "../../utils/response";
import { getAllUsersFromDB } from "./user.service";

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
