import { Request, Response, NextFunction } from "express";
import { OAuth2Client } from "google-auth-library";
import { AuthService } from "../services/AuthService";
import { UserRepository } from "../repositories/UserRepository";
import { generateToken } from "../utils/jwt";
import {
  RegistrationSchema,
  LoginSchema,
  ChangePasswordSchema,
  UpdateProfileSchema,
} from "../validators/authValidator";
import { AppError } from "../utils/errors";

export class AuthController {
  private authService: AuthService;
  private userRepository: UserRepository;
  private googleClient: OAuth2Client;

  constructor() {
    this.authService = new AuthService();
    this.userRepository = new UserRepository();
    // Using environment variable with fallback/empty for typing;
    // it will throw an error at runtime if not configured before usage
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  /**
   * Google Sign-In / Sign-Up
   */
  async googleLogin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { credential, role } = req.body;
      if (!credential) {
        throw new AppError("Google credential is required", 400);
      }

      // Default to student if an invalid role is somehow provided
      const requestedRole = ["student", "teacher", "client"].includes(role)
        ? role
        : "student";

      // Verify the token
      const ticket = await this.googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new AppError("Invalid Google token payload", 400);
      }

      const { email, name, sub: googleId } = payload;
      let user = await this.userRepository.findByEmail(email);

      // Create a user if they don't exist
      if (!user) {
        user = await this.userRepository.create({
          name: name || "Google User",
          email: email,
          // Generate a long random password for Google-auth users
          password:
            Math.random().toString(36).slice(-10) +
            Math.random().toString(36).slice(-10),
          role: requestedRole,
          authProvider: "google",
          googleId: googleId,
        } as any);
      } else if (!user.googleId) {
        // Update existing user with google info if logging in with google for the first time
        user = await this.userRepository.updateById(user._id.toString(), {
          authProvider: "google",
          googleId: googleId,
        });
      }

      // Format payload for JWT token
      const token = generateToken({
        userId: user!._id.toString(),
        email: user!.email,
        role: user!.role,
      });

      // Save token in MongoDB
      const updatedUser = await this.userRepository.updateById(
        user!._id.toString(),
        {
          sessionToken: token,
        },
      );

      if (!updatedUser) {
        throw new AppError("Failed to issue session token", 500);
      }

      // Get user object without password and sensitive information
      const userObj: any = updatedUser.toObject();
      delete userObj.password;
      delete userObj.sessionToken;

      res.status(200).json({
        success: true,
        message: "Google login successful",
        data: {
          user: userObj,
          token,
          needsOnboarding: !userObj.isProfileComplete,
        },
      });
    } catch (error: any) {
      console.error("Google verify error:", error.message);
      res
        .status(401)
        .json({ success: false, message: "Google Authentication failed" });
    }
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
