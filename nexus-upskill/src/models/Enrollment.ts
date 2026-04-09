import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { ENROLLMENT_STATUS } from "../config/constants";

export interface IEnrollment extends Document {
  studentId: ObjectId;
  courseId: ObjectId;
  status:
    | "awaiting_admin_approval"
    | "payment_requested"
    | "payment_submitted"
    | "active"
    | "completed"
    | "rejected";
  paymentStatus:
    | "not_requested"
    | "payment_requested"
    | "payment_submitted"
    | "paid_to_admin_escrow"
    | "settled_to_teacher";
  payableAmount: number;
  progress: number; // percentage 0-100
  adminApprovedAt?: Date;
  paymentRequestedAt?: Date;
  paymentConfirmedAt?: Date;
  adminSettled: boolean;
  settledAt?: Date;
  platformFeePercentage: number;
  platformFeeAmount: number;
  teacherSettlementAmount: number;
  enrolledAt: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    status: {
      type: String as any,
      enum: [
        "awaiting_admin_approval",
        "payment_requested",
        "payment_submitted",
        "active",
        "completed",
        "rejected",
      ],
      default: "awaiting_admin_approval",
    },
    paymentStatus: {
      type: String,
      enum: [
        "not_requested",
        "payment_requested",
        "payment_submitted",
        "paid_to_admin_escrow",
        "settled_to_teacher",
      ],
      default: "not_requested",
    },
    payableAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    adminApprovedAt: {
      type: Date,
      default: null,
    },
    paymentRequestedAt: {
      type: Date,
      default: null,
    },
    paymentConfirmedAt: {
      type: Date,
      default: null,
    },
    adminSettled: {
      type: Boolean,
      default: false,
    },
    settledAt: {
      type: Date,
      default: null,
    },
    platformFeePercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    platformFeeAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    teacherSettlementAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Performance Indexes for faster queries
EnrollmentSchema.index(
  { studentId: 1, courseId: 1 },
  { unique: true, sparse: true },
);
EnrollmentSchema.index({ studentId: 1, status: 1 }); // For finding student enrollments by status
EnrollmentSchema.index({ courseId: 1, status: 1 }); // For finding course enrollments by status
EnrollmentSchema.index({ status: 1 }); // For filtering by status
EnrollmentSchema.index({ createdAt: -1 }); // For sorting by creation time
EnrollmentSchema.index({ studentId: 1, createdAt: -1 }); // For student enrollments sorted by date
EnrollmentSchema.index({ paymentStatus: 1 }); // For finding enrollments by payment status

export default mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema);
