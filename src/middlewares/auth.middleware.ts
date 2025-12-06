import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response";

const JWT_SECRET: string = "myjwtsecret123";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: string; email?: string };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json(errorResponse("Authorization header missing or malformed", "Missing token"));
  }

  const token = header.split(" ")[1] as string;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;

    req.user = {
      id: payload.id,
      role: payload.role,
      email: payload.email,
    };

    return next();
  } catch (err: any) {
    return res.status(401).json(errorResponse("Invalid or expired token", err.message));
  }
};


export const permitAdmin = (req: Request, res: Response, next: NextFunction) => {
  const role = req.user?.role;
  if (!role) return res.status(401).json(errorResponse("Unauthorized", "No role found"));
  if (role !== "admin") return res.status(403).json(errorResponse("Forbidden: insufficient permissions", "Admin only"));
  next();
};
