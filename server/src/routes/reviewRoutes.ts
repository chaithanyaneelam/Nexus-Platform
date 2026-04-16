import { Router } from "express";
import { ReviewController } from "../controllers/ReviewController";
import { authenticate } from "../middleware/auth";

const router = Router();

// POST /api/reviews/submit
router.post("/submit", authenticate, ReviewController.submitReview);

// GET /api/reviews/teacher/:id
router.get("/teacher/:id", ReviewController.getTeacherReviews);

// GET /api/reviews/course/:id
router.get("/course/:id", ReviewController.getCourseReviews);

export default router;
