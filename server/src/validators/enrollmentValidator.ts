import { z } from "zod";

// Enroll in course
export const EnrollSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
});

export type EnrollBody = z.infer<typeof EnrollSchema>;

// Update enrollment progress
export const UpdateEnrollmentSchema = z.object({
  progress: z
    .number()
    .min(0, "Progress cannot be negative")
    .max(100, "Progress cannot exceed 100"),

  status: z
    .enum([
      "awaiting_admin_approval",
      "payment_requested",
      "payment_submitted",
      "active",
      "completed",
      "rejected",
    ])
    .optional(),
});

export type UpdateEnrollmentBody = z.infer<typeof UpdateEnrollmentSchema>;
