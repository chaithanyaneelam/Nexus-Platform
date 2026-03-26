import { Router } from "express";
import { CourseController } from "../controllers/CourseController";
import {
  authenticate,
  authorize,
  isTeacher,
  isAdmin,
} from "../middleware/auth";

const router = Router();
const courseController = new CourseController();

/**
 * Public Routes
 */

// Get all published courses
router.get("/", (req, res, next) =>
  courseController.getAllCourses(req, res, next),
);

// Get trending courses
router.get("/trending", (req, res, next) =>
  courseController.getTrendingCourses(req, res, next),
);

/**
 * Teacher Routes
 */

// Create new course (Teacher only)
router.post("/", authenticate, isTeacher, (req, res, next) =>
  courseController.createCourse(req, res, next),
);

// Get teacher's courses
router.get("/teacher/my-courses", authenticate, isTeacher, (req, res, next) =>
  courseController.getTeacherCourses(req, res, next),
);

// Update course (Teacher only)
router.put("/:courseId", authenticate, isTeacher, (req, res, next) =>
  courseController.updateCourse(req, res, next),
);

// Delete course (Teacher only)
router.delete("/:courseId", authenticate, isTeacher, (req, res, next) =>
  courseController.deleteCourse(req, res, next),
);

// Publish/Unpublish course (Teacher only)
router.patch("/:courseId/publish", authenticate, isTeacher, (req, res, next) =>
  courseController.publishCourse(req, res, next),
);

/**
 * Admin Routes
 */

// Toggle trending status (Admin only)
router.patch("/:courseId/trending", authenticate, isAdmin, (req, res, next) =>
  courseController.toggleTrending(req, res, next),
);

/**
 * Admin Course Approval Routes
 */

// Get pending courses (Admin only)
router.get("/admin/pending", authenticate, isAdmin, (req, res, next) =>
  courseController.getPendingCourses(req, res, next),
);

// Approve course (Admin only)
router.patch("/:courseId/approve", authenticate, isAdmin, (req, res, next) =>
  courseController.approveCourse(req, res, next),
);

// Reject course (Admin only)
router.patch("/:courseId/reject", authenticate, isAdmin, (req, res, next) =>
  courseController.rejectCourse(req, res, next),
);

// Get course by ID
router.get("/:courseId", (req, res, next) =>
  courseController.getCourseById(req, res, next),
);

export default router;
