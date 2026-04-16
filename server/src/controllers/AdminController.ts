import { Request, Response } from "express";
import AdminService from "../services/AdminService";
import PaymentService from "../services/PaymentService";

export class AdminController {
  private adminService = AdminService;
  private paymentService = PaymentService;

  /**
   * Get all pending enrollments awaiting admin approval
   */
  async getPendingEnrollments(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await this.adminService.getPendingEnrollments(page, limit);

      res.json({
        success: true,
        message: "Pending enrollments retrieved successfully",
        data: result.enrollments,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch pending enrollments",
      });
    }
  }

  /**
   * Admin requests payment from student for an enrollment
   */
  async requestPayment(req: Request, res: Response) {
    try {
      const { enrollmentId } = req.params;

      const result = await this.adminService.requestPayment(enrollmentId);

      res.json({
        success: true,
        message:
          "Enrollment approved. Payment request created. Student will be asked to pay.",
        data: {
          enrollment: result.enrollment,
          payment: result.payment,
        },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to approve enrollment",
      });
    }
  }

  /**
   * Backward compatible alias
   */
  async approveEnrollment(req: Request, res: Response) {
    return this.requestPayment(req, res);
  }

  /**
   * Admin rejects enrollment
   */
  async rejectEnrollment(req: Request, res: Response) {
    try {
      const { enrollmentId } = req.params;
      const { reason } = req.body;

      if (!reason) {
        return res.status(400).json({
          success: false,
          message: "Rejection reason is required",
        });
      }

      const enrollment = await this.adminService.rejectEnrollment(
        enrollmentId,
        reason,
      );

      res.json({
        success: true,
        message: "Enrollment rejected",
        data: enrollment,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to reject enrollment",
      });
    }
  }

  /**
   * Get all pending payments (awaiting student transaction ID or admin approval)
   */
  async getPendingPayments(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await this.adminService.getPendingPayments(page, limit);

      res.json({
        success: true,
        message: "Pending payments retrieved successfully",
        data: result.payments,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch pending payments",
      });
    }
  }

  /**
   * Get all teacher dues (payments approved, awaiting settlement)
   */
  async getTeacherDues(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await this.adminService.getTeacherDues(page, limit);

      res.json({
        success: true,
        message: "Teacher dues retrieved successfully",
        data: result.payments,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch teacher dues",
      });
    }
  }

  /**
   * Admin approves payment (after verifying transaction ID)
   */
  async approvePayment(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;
      const adminId = (req as any).userId as string | undefined;

      const result = await this.adminService.approvePayment(paymentId, adminId);

      res.json({
        success: true,
        message:
          "Payment approved! Enrollment activated. Complete this payment to teacher.",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to approve payment",
      });
    }
  }

  /**
   * Admin rejects payment
   */
  async rejectPayment(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;
      const { reason } = req.body;

      if (!reason) {
        return res.status(400).json({
          success: false,
          message: "Rejection reason is required",
        });
      }

      const result = await this.adminService.rejectPayment(paymentId, reason);

      res.json({
        success: true,
        message: "Payment rejected",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to reject payment",
      });
    }
  }

  /**
   * Admin settles teacher payment from escrow
   */
  async settleTeacherPayment(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;
      const adminId = (req as any).userId as string | undefined;

      const payment = await this.adminService.settleTeacherPayment(
        paymentId,
        adminId,
      );

      res.json({
        success: true,
        message: "Settlement completed and teacher balance credited",
        data: payment,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to mark payment as paid",
      });
    }
  }

  /**
   * Backward compatible alias
   */
  async markAsPaidToTeacher(req: Request, res: Response) {
    return this.settleTeacherPayment(req, res);
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(req: Request, res: Response) {
    try {
      const stats = await this.adminService.getAdminDashboardStats();

      res.json({
        success: true,
        message: "Admin dashboard stats retrieved",
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch dashboard stats",
      });
    }
  }

  /**
   * Get all users
   */
  async getAllUsers(req: Request, res: Response) {
    try {
      const role = (req.query.role as string) || undefined;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await this.adminService.getAllUsers(role, page, limit);

      res.json({
        success: true,
        message: "Users retrieved successfully",
        data: result.users,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch users",
      });
    }
  }

  /**
   * Get detailed user info (includes sensitive data - admin only)
   */
  async getUserDetails(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const user = await this.adminService.getUserDetails(userId);

      res.json({
        success: true,
        message: "User details retrieved",
        data: user,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || "User not found",
      });
    }
  }

  /**
   * Get teacher's pending dues
   */
  async getTeacherPendingDues(req: Request, res: Response) {
    try {
      const { teacherId } = req.params;
      const result = await this.adminService.getTeacherPendingDues(teacherId);

      res.json({
        success: true,
        message: "Teacher pending dues retrieved",
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch pending dues",
      });
    }
  }
}

export default new AdminController();
