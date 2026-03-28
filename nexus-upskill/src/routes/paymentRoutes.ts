import { Router } from "express";
import { PaymentController } from "../controllers/PaymentController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();
const paymentController = new PaymentController();

/**
 * Student Routes
 */

// Get payment requests (payments awaiting transaction ID submission)
router.get("/my-requests", authenticate, (req, res, next) =>
  paymentController.getPaymentRequests(req, res, next),
);

// Submit transaction ID after paying via UPI
router.post("/:paymentId/submit-transaction", authenticate, (req, res, next) =>
  paymentController.submitTransactionId(req, res, next),
);

// Get payment history (all student payments)
router.get("/my-payments", authenticate, (req, res, next) =>
  paymentController.getPaymentHistory(req, res, next),
);

// Get payment by transaction ID
router.get("/transaction/:transactionId", authenticate, (req, res, next) =>
  paymentController.getPaymentByTransactionId(req, res, next),
);

/**
 * Teacher Routes
 */

// Get teacher's pending dues (payments approved, not yet transferred)
router.get("/teacher/pending-dues", authenticate, (req, res, next) =>
  paymentController.getTeacherPendingDues(req, res, next),
);

// Get teacher's completed/paid earnings
router.get("/teacher/earnings", authenticate, (req, res, next) =>
  paymentController.getTeacherEarnings(req, res, next),
);

/**
 * Admin Routes
 */

// Get admin pending payments for review
router.get(
  "/admin/pending",
  authenticate,
  authorize("admin"),
  (req, res, next) => paymentController.getAdminPendingPayments(req, res, next),
);

// Get admin dashboard stats
router.get("/admin/stats", authenticate, authorize("admin"), (req, res, next) =>
  paymentController.getAdminStats(req, res, next),
);

// Admin approves a payment
router.post(
  "/admin/:paymentId/approve",
  authenticate,
  authorize("admin"),
  (req, res, next) => paymentController.approvePayment(req, res, next),
);

// Admin rejects a payment
router.post(
  "/admin/:paymentId/reject",
  authenticate,
  authorize("admin"),
  (req, res, next) => paymentController.rejectPayment(req, res, next),
);

export default router;
