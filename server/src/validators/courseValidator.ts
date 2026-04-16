import { z } from "zod";
import type { ObjectId } from "mongoose";

// Create course validation
export const CreateCourseSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must not exceed 100 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters"),

  duration: z
    .number()
    .min(1, "Duration must be at least 1 month")
    .max(60, "Duration must not exceed 60 months"),
  // Number of months the course will continue

  price: z
    .number()
    .min(0, "Price cannot be negative")
    .max(100000, "Price must be reasonable"),

  company: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must not exceed 100 characters"),

  role: z
    .string()
    .min(2, "Role must be at least 2 characters")
    .max(100, "Role must not exceed 100 characters"),

  highlights: z
    .array(
      z
        .string()
        .min(5, "Each highlight must be at least 5 characters")
        .max(500, "Each highlight must not exceed 500 characters"),
    )
    .min(1, "At least one highlight is required")
    .max(10, "Maximum 10 highlights allowed"),

  isTrending: z.boolean().default(false),
  status: z
    .enum(["pending_admin_approval", "published", "rejected"])
    .default("pending_admin_approval"),
});

export type CreateCourseBody = z.infer<typeof CreateCourseSchema>;

// Update course validation
export const UpdateCourseSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must not exceed 100 characters")
    .optional(),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters")
    .optional(),

  duration: z
    .number()
    .min(1, "Duration must be at least 1 month")
    .max(60, "Duration must not exceed 60 months")
    .optional(),
  // Number of months the course will continue

  price: z
    .number()
    .min(0, "Price cannot be negative")
    .max(100000, "Price must be reasonable")
    .optional(),

  company: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must not exceed 100 characters")
    .optional(),

  role: z
    .string()
    .min(2, "Role must be at least 2 characters")
    .max(100, "Role must not exceed 100 characters")
    .optional(),

  highlights: z
    .array(
      z
        .string()
        .min(5, "Each highlight must be at least 5 characters")
        .max(500, "Each highlight must not exceed 500 characters"),
    )
    .min(1, "At least one highlight is required")
    .max(10, "Maximum 10 highlights allowed")
    .optional(),

  status: z
    .enum(["pending_admin_approval", "published", "rejected"])
    .optional(),
});

export type UpdateCourseBody = z.infer<typeof UpdateCourseSchema>;

// Publish course
export const PublishCourseSchema = z.object({
  status: z.enum(["pending_admin_approval"]),
});

export type PublishCourseBody = z.infer<typeof PublishCourseSchema>;

// Toggle trending
export const ToggleTrendingSchema = z.object({
  isTrending: z.boolean(),
});

export type ToggleTrendingBody = z.infer<typeof ToggleTrendingSchema>;
