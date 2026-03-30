import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authenticate } from "../middleware/auth";

const router = Router();
const authController = new AuthController();

/**
 * Public Routes
 */

// Register new user
router.post("/register", (req, res, next) =>
  authController.register(req, res, next),
);

// Login user
router.post("/login", (req, res, next) => authController.login(req, res, next));

// Google Login
router.post("/google", (req, res, next) =>
  authController.googleLogin(req, res, next),
);

/**
 * Protected Routes (Authenticated users only)
 */

// Get current user profile
router.get("/profile", authenticate, (req, res, next) =>
  authController.getProfile(req, res, next),
);

// Update user profile
router.put("/profile", authenticate, (req, res, next) =>
  authController.updateProfile(req, res, next),
);

// Change password
router.post("/change-password", authenticate, (req, res, next) =>
  authController.changePassword(req, res, next),
);

export default router;
