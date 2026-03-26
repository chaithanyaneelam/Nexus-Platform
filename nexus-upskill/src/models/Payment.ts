import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { PAYMENT_STATUS } from "../config/constants";

export interface IPayment extends Document {
  studentId: ObjectId;
  teacherId: ObjectId;
  courseId: ObjectId;
  enrollmentId: ObjectId;
  amount: number;
  adminCommission: number;
  teacherPayment: number;
  transactionId?: string; // Made optional - filled by student later
  status:
    | "payment_requested"
    | "transaction_submitted"
    | "approved"
    | "paid_to_teacher"
    | "rejected";
  adminUpiId: string; // UPI ID where student should pay
  adminRequestedAt?: Date; // When admin asks student to pay
  transactionSubmittedAt?: Date; // When student submits transaction ID
  adminApprovedAt?: Date; // When admin approves payment
  paidToTeacherAt?: Date; // When payment is sent to teacher
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    enrollmentId: {
      type: Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    adminCommission: {
      type: Number,
      required: true,
      min: 0,
    },
    teacherPayment: {
      type: Number,
      required: true,
      min: 0,
    },
    transactionId: {
      type: String,
      default: null,
      sparse: true,
    },
    status: {
      type: String as any,
      enum: [
        "payment_requested",
        "transaction_submitted",
        "approved",
        "paid_to_teacher",
        "rejected",
      ],
      default: "payment_requested",
    },
    adminUpiId: {
      type: String,
      required: true,
    },
    adminRequestedAt: {
      type: Date,
      default: null,
    },
    transactionSubmittedAt: {
      type: Date,
      default: null,
    },
    adminApprovedAt: {
      type: Date,
      default: null,
    },
    paidToTeacherAt: {
      type: Date,
      default: null,
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

// Ensure a student can't have multiple pending/approved payments for same course
PaymentSchema.index(
  { studentId: 1, courseId: 1, status: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: {
      status: {
        $in: ["payment_requested", "transaction_submitted", "approved"],
      },
    },
  },
);

export default mongoose.model<IPayment>("Payment", PaymentSchema);
