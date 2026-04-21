import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be a positive number"),
  languagePreferences: z.string().optional().default("Any language"),
  timePeriod: z.string().min(1, "Time period is required"),
});

export const updateProjectStatusSchema = z.object({
  status: z.enum(["open", "in-progress", "completed", "closed"]),
});

export const applyProjectSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(["approved", "rejected"]),
});
