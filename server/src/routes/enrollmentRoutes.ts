import { Router } from "express";
import { EnrollmentController } from "../controllers/EnrollmentController";
import { authenticate, isTeacher, authorize } from "../middleware/auth";

const router = Router();
const enrollmentController = new EnrollmentController();

/**
 * Student Routes
 */

// Enroll in a course
router.post("/", authenticate, (req, res, next) =>
  enrollmentController.enrollInCourse(req, res, next),
);

// Get my enrollments
router.get("/my-enrollments", authenticate, (req, res, next) =>
  enrollmentController.getMyEnrollments(req, res, next),
);

// Update enrollment progress
router.patch("/:enrollmentId/progress", authenticate, (req, res, next) =>
  enrollmentController.updateProgress(req, res, next),
);

// Update enrollment status
router.patch("/:enrollmentId/status", authenticate, (req, res, next) =>
  enrollmentController.updateStatus(req, res, next),
);

// Mark enrollment as completed
router.patch("/:enrollmentId/complete", authenticate, (req, res, next) =>
  enrollmentController.completeEnrollment(req, res, next),
);

// Get enrollment by ID
router.get("/:enrollmentId", authenticate, (req, res, next) =>
  enrollmentController.getEnrollmentById(req, res, next),
);

/**
 * Teacher Routes
 */

// Get course enrollments (Teacher)
router.get(
  "/course/:courseId/enrollments",
  authenticate,
  isTeacher,
  (req, res, next) => enrollmentController.getCourseEnrollments(req, res, next),
);

// Get teacher's active students (Teacher)
router.get(
  "/teacher/students/list",
  authenticate,
  isTeacher,
  (req, res, next) => enrollmentController.getTeacherStudents(req, res, next),
);

/**
 * Admin Routes
 */

// Get pending enrollments (Admin only)
router.get(
  "/admin/pending",
  authenticate,
  authorize("admin"),
  (req, res, next) =>
    enrollmentController.getPendingEnrollments(req, res, next),
);

// Approve student enrollment (Admin)
router.patch(
  "/:enrollmentId/approve",
  authenticate,
  authorize("admin"),
  (req, res, next) => enrollmentController.approveEnrollment(req, res, next),
);

// Reject student enrollment (Admin)
router.patch(
  "/:enrollmentId/reject",
  authenticate,
  authorize("admin"),
  (req, res, next) => enrollmentController.rejectEnrollment(req, res, next),
);

// Get teacher's courses with students (Admin)
router.get(
  "/admin/teacher/:teacherId/courses",
  authenticate,
  authorize("admin"),
  (req, res, next) =>
    enrollmentController.getTeacherCoursesWithStudents(req, res, next),
);

// Get all teachers with courses (Admin)
router.get(
  "/admin/teachers/courses",
  authenticate,
  authorize("admin"),
  (req, res, next) =>
    enrollmentController.getAllTeachersWithCourses(req, res, next),
);

export default router;
