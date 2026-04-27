import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { AppError } from "../utils/errors";
import {
  generateUniqueUsername,
  validateUsername,
  isUsernameReserved,
} from "../utils/username";

export class UserController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async completeOnboarding(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).userId;
      if (!userId) {
        throw new AppError("User ID not found", 401);
      }

      const { role, mobileNumber, linkedinUrl, githubUrl, username } = req.body;

      // Validate inputs
      if (!role || !["teacher", "student", "client"].includes(role)) {
        throw new AppError(
          "Valid role (teacher, student, or client) is required",
          400,
        );
      }
      if (!mobileNumber) {
        throw new AppError("Mobile number is required", 400);
      }

      // Get the user to check if they already have a username
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new AppError("User not found", 404);
      }

      let finalUsername = user.username;

      // If username is provided, validate and use it
      if (username) {
        // Check if username is reserved first
        if (isUsernameReserved(username)) {
          throw new AppError(
            `The username "${username}" is reserved and cannot be used. Please choose a different username.`,
            400,
          );
        }

        if (!validateUsername(username)) {
          throw new AppError(
            "Username must be 3-20 characters with only lowercase letters, numbers, underscores, and hyphens",
            400,
          );
        }
        // Check if username is available
        const existingUsername =
          await this.userRepository.findByUsername(username);
        if (existingUsername && existingUsername._id.toString() !== userId) {
          throw new AppError("This username is already taken", 400);
        }
        finalUsername = username;
      } else if (!finalUsername) {
        // Generate unique username if not already set and not provided
        finalUsername = await generateUniqueUsername(
          user.name,
          this.userRepository,
        );
      }

      const updatedUser = await this.userRepository.updateById(userId, {
        role,
        mobileNumber,
        linkedinUrl: linkedinUrl || undefined,
        githubUrl: githubUrl || undefined,
        username: finalUsername,
        isProfileComplete: true,
      });

      if (!updatedUser) {
        throw new AppError("User not found", 404);
      }

      const userObj: any = updatedUser.toObject();
      delete userObj.password;
      delete userObj.sessionToken;

      res.status(200).json({
        success: true,
        message: "Profile onboarding completed successfully",
        data: userObj,
      });
    } catch (error) {
      next(error);
    }
  }
}
