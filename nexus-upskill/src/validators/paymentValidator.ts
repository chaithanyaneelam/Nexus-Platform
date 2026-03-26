import { z } from "zod";

// Initialize payment
export const InitiatePaymentSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),

  amount: z.number().min(1, "Amount must be greater than 0"),

  transactionId: z.string().min(1, "Transaction ID is required"),

  screenshotUrl: z.string().url("Invalid screenshot URL").optional(),
});

export type InitiatePaymentBody = z.infer<typeof InitiatePaymentSchema>;

// Verify payment (admin only)
export const VerifyPaymentSchema = z.object({
  status: z.enum(["paid_to_teacher", "rejected"]),
  rejectionReason: z.string().optional(),
});

export type VerifyPaymentBody = z.infer<typeof VerifyPaymentSchema>;
