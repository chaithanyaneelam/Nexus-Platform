import bcryptjs from "bcryptjs";
import { AppError, ValidationError } from "../utils/errors";
import { generateToken, verifyToken } from "../utils/jwt";
import { UserRepository } from "../repositories/UserRepository";
import type { IUser } from "../models/User";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Register a new user
   */
  async register(data: {
    name: string;
    email: string;
    password: string;
    role: "student" | "teacher" | "admin";
    mobileNumber?: string | null;
    company?: string;
    upiId?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    interests?: string[];
    profession?: string;
  }): Promise<{ user: Partial<IUser>; token: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ValidationError("User with this email already exists");
    }

    // Create user - password hashing is handled by User model's pre-save hook
    const userData = {
      ...data,
      authProvider: "local",
    };

    let user = await this.userRepository.create(userData as any);

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const updatedUser = await this.userRepository.updateById(
      user._id.toString(),
      {
        sessionToken: token,
      },
    );

    if (!updatedUser) {
      throw new ValidationError("Failed to update session token");
    }

    // Return user data without password
    const { password, sessionToken, ...userWithoutPassword } =
      updatedUser.toObject();

    return {
      user: userWithoutPassword as any,
      token,
    };
  }

  /**
   * Login user
   */
  async login(
    email: string,
    password: string,
  ): Promise<{ user: Partial<IUser>; token: string }> {
    // Find user by email
    let user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ValidationError("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ValidationError("Invalid email or password");
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const updatedUser = await this.userRepository.updateById(
      user._id.toString(),
      {
        sessionToken: token,
      },
    );

    if (!updatedUser) {
      throw new ValidationError("Failed to update session token");
    }

    // Return user data without password
    const {
      password: _,
      sessionToken,
      ...userWithoutPassword
    } = updatedUser.toObject();

    return {
      user: userWithoutPassword as any,
      token,
    };
  }

  /**
   * Verify JWT token
   */
  async verifyToken(token: string): Promise<{
    userId: string;
    email: string;
    role: string;
  }> {
    try {
      const decoded = verifyToken(token);
      if (!decoded) {
        throw new ValidationError("Invalid token");
      }
      return decoded;
    } catch (error) {
      throw new ValidationError("Invalid token");
    }
  }

  /**
   * Change password
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    // Find user
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Verify current password using User model's comparePassword method
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new ValidationError("Current password is incorrect");
    }

    // Update password directly and let pre-save hook handle hashing
    user.password = newPassword;
    await user.save();
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<Partial<IUser>> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const { password, sessionToken, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword as any;
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: {
      name?: string;
      mobileNumber?: string;
      company?: string;
      linkedinUrl?: string;
      githubUrl?: string;
      interests?: string[];
      profession?: string;
      upiId?: string;
    },
  ): Promise<Partial<IUser>> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const updatedUser = await this.userRepository.updateById(userId, data);
    const { password, sessionToken, ...userWithoutPassword } =
      updatedUser!.toObject();

    return userWithoutPassword as any;
  }
}
