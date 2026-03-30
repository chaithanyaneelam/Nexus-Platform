import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database";
import { APP_CONFIG } from "./config/constants";

import authRoutes from "./routes/authRoutes";
import courseRoutes from "./routes/courseRoutes";
import enrollmentRoutes from "./routes/enrollmentRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import adminRoutes from "./routes/adminRoutes";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "success",
    message: "Nexus Upskill API is running!",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

const validationMessages: Record<string, string> = {
  password:
    "Password must contain at least one uppercase letter, one lowercase letter, and one number. Minimum 6 characters.",
  email: "Please enter a valid email address",
  name: "Please enter a valid name",
  mobileNumber: "Please enter a valid 10-digit mobile number",
  role: "Please select a valid role (student, teacher, or admin)",
  "confirm password": "Passwords do not match",
  upiId: "Please enter a valid UPI ID",
  linkedinUrl: "Please enter a valid LinkedIn URL",
  githubUrl: "Please enter a valid GitHub URL",
};

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === "ZodError") {
    const fieldErrors: Record<string, string> = {};
    err.errors.forEach((error: any) => {
      const fieldName = error.path[0] || "unknown";
      const field = String(fieldName).toLowerCase();
      fieldErrors[fieldName] =
        validationMessages[field] || error.message || "Invalid input";
    });

    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: fieldErrors,
    });
  }

  console.error("Error:", err.message);
  res.status(err.status || err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(APP_CONFIG.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    if (process.env.VERCEL) {
      return;
    }

    app.listen(APP_CONFIG.PORT, () => {
      console.log(
        `\n🎓 Nexus Upskill Server started on http://localhost:${APP_CONFIG.PORT}`,
      );
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to start server:", error.message);
    } else {
      console.error("Failed to start server: Unknown error");
    }
    process.exit(1);
  }
};

startServer();

export default app;
