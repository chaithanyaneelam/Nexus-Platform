import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { AppError } from "../utils/errors";

export class UserController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async completeOnboarding(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).userId;
      if (!userId) {
        throw new AppError("User ID not found", 401);
      }

      const { role, mobileNumber, linkedinUrl, githubUrl } = req.body;

      // Validate inputs
      if (!role || !["teacher", "student"].includes(role)) {
        throw new AppError("Valid role (teacher or student) is required", 400);
      }
      if (!mobileNumber) {
        throw new AppError("Mobile number is required", 400);
      }

      const updatedUser = await this.userRepository.updateById(userId, {
        role,
        mobileNumber,
        linkedinUrl: linkedinUrl || undefined,
        githubUrl: githubUrl || undefined,
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
