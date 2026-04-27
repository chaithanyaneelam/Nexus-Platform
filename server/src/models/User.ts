import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { ROLES } from "../config/constants";

export interface IUser extends Document {
  name: string;
  username?: string; // Unique username for profile URLs like studbridge/student/username
  email: string;
  password: string;
  role: "admin" | "teacher" | "student" | "client";
  mobileNumber?: string;
  interests: string[];
  upiId?: string; // For teachers
  linkedinUrl?: string;
  githubUrl?: string;
  profession?: string; // For employees
  company?: string; // For employees
  adminEscrowBalance: number;
  teacherWalletBalance: number;
  averageRating?: number;
  totalReviews?: number;
  authProvider: "local" | "google";
  googleId?: string;
  sessionToken?: string;
  isProfileComplete?: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      sparse: true,
      index: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9_-]{3,20}$/,
        "Username must be 3-20 characters, lowercase letters, numbers, underscores and hyphens only",
      ],
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String as any,
      enum: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.CLIENT],
      default: ROLES.STUDENT,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,
      default: null,
      sparse: true,
    },
    sessionToken: {
      type: String,
      default: null,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    mobileNumber: {
      type: String,
      match: [/^\d{10}$/, "Mobile number must be 10 digits"],
      default: null,
    },
    interests: {
      type: [String],
      default: [],
    },
    upiId: {
      type: String,
      default: null,
      sparse: true,
    },
    linkedinUrl: {
      type: String,
      default: null,
    },
    githubUrl: {
      type: String,
      default: null,
    },
    profession: {
      type: String,
      default: null,
    },
    company: {
      type: String,
      default: null,
      sparse: true,
    },
    adminEscrowBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    teacherWalletBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Performance Indexes
UserSchema.index({ role: 1 }); // For finding teachers/students
UserSchema.index({ createdAt: -1 }); // For sorting by creation time
UserSchema.index({ email: 1 }); // Already exists but explicit
UserSchema.index({ role: 1, createdAt: -1 }); // Composite for filtering teachers by date

export default mongoose.model<IUser>("User", UserSchema);
