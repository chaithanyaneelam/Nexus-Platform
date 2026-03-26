import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";
import {
  RegistrationSchema,
  LoginSchema,
  ChangePasswordSchema,
  UpdateProfileSchema,
} from "../validators/authValidator";
import { AppError } from "../utils/errors";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register new user
   */
  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // Validate request
      const validatedData = RegistrationSchema.parse(req.body);

      // Register user
      const result = await this.authService.register(validatedData);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: result.user,
          token: result.token,
        },
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Login user
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request
      const { email, password } = LoginSchema.parse(req.body);

      // Login user
      const result = await this.authService.login(email, password);

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: result.user,
          token: result.token,
        },
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).userId;

      if (!userId) {
        throw new AppError("User ID not found", 401);
      }

      const user = await this.authService.getProfile(userId);

      res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).userId;

      if (!userId) {
        throw new AppError("User ID not found", 401);
      }

      // Validate request
      const validatedData = UpdateProfileSchema.parse(req.body);

      // Update profile
      const updatedUser = await this.authService.updateProfile(
        userId,
        validatedData,
      );

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change password
   */
  async changePassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).userId;

      if (!userId) {
        throw new AppError("User ID not found", 401);
      }

      // Validate request
      const { currentPassword, newPassword } = ChangePasswordSchema.parse(
        req.body,
      );

      // Change password
      await this.authService.changePassword(
        userId,
        currentPassword,
        newPassword,
      );

      res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
