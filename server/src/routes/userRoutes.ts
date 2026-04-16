import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authenticate } from "../middleware/auth";

const router = Router();
const userController = new UserController();

router.patch("/complete-onboarding", authenticate, (req, res, next) =>
  userController.completeOnboarding(req, res, next)
);

export default router;
