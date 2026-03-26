import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { COURSE_STATUS } from "../config/constants";

export interface ICourse extends Document {
  title: string;
  description: string;
  teacherId: ObjectId;
  duration: number; // in months - how many months the course will continue
  price: number;
  company: string; // Company for work experience course
  role: string; // Role/Position for work experience course
  highlights: string[];
  isTrending: boolean;
  status: "pending_admin_approval" | "published" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    highlights: {
      type: [String],
      default: [],
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String as any,
      enum: [
        COURSE_STATUS.PENDING_ADMIN_APPROVAL,
        COURSE_STATUS.PUBLISHED,
        COURSE_STATUS.REJECTED,
      ],
      default: COURSE_STATUS.PENDING_ADMIN_APPROVAL,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ICourse>("Course", CourseSchema);
