import { z } from "zod";

// Registration validation
export const RegistrationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),

  email: z.string().email("Invalid email format"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),

  role: z.enum(["student", "teacher", "client", "admin"]).default("student"),

  mobileNumber: z
    .string()
    .regex(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .optional()
    .nullable(),

  interests: z.array(z.string()).optional().default([]),

  company: z.string().optional().or(z.literal("")),

  upiId: z
    .string()
    .regex(/^[a-zA-Z0-9.\-_]{3,}@[a-zA-Z]{3,}$/, "Invalid UPI ID format")
    .optional()
    .or(z.literal("")),

  linkedinUrl: z
    .string()
    .url("Invalid LinkedIn URL")
    .optional()
    .or(z.literal("")),

  githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),

  profession: z.string().optional().or(z.literal("")),
});

export type RegistrationBody = z.infer<typeof RegistrationSchema>;

// Login validation
export const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),

  password: z.string().min(1, "Password is required"),
});

export type LoginBody = z.infer<typeof LoginSchema>;

// Password change validation
export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordBody = z.infer<typeof ChangePasswordSchema>;

// Profile update validation
export const UpdateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .optional(),

  mobileNumber: z
    .string()
    .regex(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .optional()
    .or(z.literal("")),

  company: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  interests: z.array(z.string()).optional(),
  profession: z.string().optional(),
  upiId: z
    .string()
    .regex(/^[a-zA-Z0-9.\-_]{3,}@[a-zA-Z]{3,}$/, "Invalid UPI ID format")
    .optional(),
});

export type UpdateProfileBody = z.infer<typeof UpdateProfileSchema>;
