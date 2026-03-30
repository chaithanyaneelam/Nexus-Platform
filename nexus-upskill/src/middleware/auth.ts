import { Request, Response, NextFunction } from "express";
import { verifyToken, ITokenPayload } from "../utils/jwt";
import { createError } from "../utils/errors";
import { ROLES } from "../config/constants";
import User from "../models/User";

/**
 * Extend Express Request to include user data
 */
declare global {
  namespace Express {
    interface Request {
      user?: ITokenPayload;
    }
  }
}

/**
 * Authentication Middleware - Verifies JWT token and checks if it matches DB session.
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError(401, "Missing or invalid authorization token");
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      throw createError(401, "Invalid or expired token");
    }

    // Connect to DB to ensure this is the active session token
    const user = await User.findById(decoded.userId);
    if (!user || user.sessionToken !== token) {
      throw createError(
        401,
        "Session expired or invalid token. Please log in again.",
      );
    }

    // Attach user info to request object
    req.user = decoded;
    (req as any).userId = decoded.userId;
    (req as any).userRole = decoded.role;
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({
        status: "error",
        message: error.message,
      });
    } else {
      res.status(401).json({
        status: "error",
        message: "Authentication failed",
      });
    }
  }
};

/**
 * Authorization Middleware - Checks if user has specific role
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw createError(401, "User not authenticated");
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw createError(
          403,
          `Access denied. Required role: ${allowedRoles.join(" or ")}`,
        );
      }

      next();
    } catch (error) {
      if (error instanceof Error) {
        const statusCode = error.message.includes("not authenticated")
          ? 401
          : 403;
        res.status(statusCode).json({
          status: "error",
          message: error.message,
        });
      } else {
        res.status(403).json({
          status: "error",
          message: "Authorization failed",
        });
      }
    }
  };
};

/**
 * Admin Only Middleware
 */
export const isAdmin = authorize(ROLES.ADMIN);

/**
 * Teacher Only Middleware
 */
export const isTeacher = authorize(ROLES.TEACHER);

/**
 * Student Only Middleware
 */
export const isStudent = authorize(ROLES.STUDENT);

/**
 * Teacher or Admin Middleware
 */
export const isTeacherOrAdmin = authorize(ROLES.TEACHER, ROLES.ADMIN);

/**
 * Any Authenticated User
 */
export const isAuthenticated = authenticate;
