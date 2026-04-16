import { Router, Request, Response } from "express";
import AdminController from "../controllers/AdminController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();
const adminController = AdminController;

// All admin routes require authentication and admin role
router.use(authenticate, authorize("admin"));

/**
 * Enrollment Approval Routes
 */

// Get all pending enrollments
router.get("/enrollments/pending", (req, res) =>
  adminController.getPendingEnrollments(req, res),
);

// Approve enrollment
router.post("/enrollments/:enrollmentId/approve", (req, res) =>
  adminController.approveEnrollment(req, res),
);

// Request payment from student (new explicit endpoint)
router.post("/enrollments/:enrollmentId/request-payment", (req, res) =>
  adminController.requestPayment(req, res),
);

// Reject enrollment
router.post("/enrollments/:enrollmentId/reject", (req, res) =>
  adminController.rejectEnrollment(req, res),
);

/**
 * Payment Approval Routes
 */

// Get all pending payments (awaiting txn ID or approval)
router.get("/payments/pending", (req, res) =>
  adminController.getPendingPayments(req, res),
);

// Get teacher dues (approved payments waiting to be settled)
router.get("/payments/dues", (req, res) =>
  adminController.getTeacherDues(req, res),
);

// Approve payment (after student submits transaction ID)
router.post("/payments/:paymentId/approve", (req, res) =>
  adminController.approvePayment(req, res),
);

// Reject payment
router.post("/payments/:paymentId/reject", (req, res) =>
  adminController.rejectPayment(req, res),
);

// Mark payment as paid to teacher
router.post("/payments/:paymentId/mark-as-paid", (req, res) =>
  adminController.markAsPaidToTeacher(req, res),
);

// Settle teacher payment (new explicit endpoint)
router.post("/payments/:paymentId/settle-teacher-payment", (req, res) =>
  adminController.settleTeacherPayment(req, res),
);

/**
 * Dashboard Routes
 */

// Get admin dashboard stats
router.get("/dashboard/stats", (req, res) =>
  adminController.getDashboardStats(req, res),
);

/**
 * User Management Routes
 */

// Get all users (with optional role filter)
router.get("/users", (req, res) => adminController.getAllUsers(req, res));

// Get detailed user info (includes mobile, UPI, etc.)
router.get("/users/:userId", (req, res) =>
  adminController.getUserDetails(req, res),
);

// Get teacher's pending dues
router.get("/teachers/:teacherId/pending-dues", (req, res) =>
  adminController.getTeacherPendingDues(req, res),
);

export default router;
