import { Request, Response, NextFunction } from "express";
import { PaymentService } from "../services/PaymentService";
import { AppError } from "../utils/errors";

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  /**
   * Get payment requests for student (payments awaiting transaction ID)
   * Student sees payment requests from admin
   */
  async getPaymentRequests(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const studentId = (req as any).userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!studentId) {
        throw new AppError("User ID not found", 401);
      }

      const result = await this.paymentService.getPaymentRequests(
        studentId,
        page,
        limit,
      );

      res.status(200).json({
        success: true,
        message: "Payment requests retrieved successfully",
        data: result.payments,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Student submits transaction ID after paying via UPI
   */
  async submitTransactionId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const studentId = (req as any).userId;
      const { paymentId } = req.params;
      const { transactionId } = req.body;

      if (!studentId) {
        throw new AppError("User ID not found", 401);
      }

      if (!transactionId) {
        throw new AppError("Transaction ID is required", 400);
      }

      const payment = await this.paymentService.submitTransactionId(
        paymentId,
        studentId,
        transactionId,
      );

      res.status(200).json({
        success: true,
        message:
          "Transaction ID submitted successfully. Waiting for admin approval.",
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get student's payment history
   */
  async getPaymentHistory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const studentId = (req as any).userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!studentId) {
        throw new AppError("User ID not found", 401);
      }

      const result = await this.paymentService.getStudentPayments(
        studentId,
        page,
        limit,
      );

      res.status(200).json({
        success: true,
        message: "Payment history fetched successfully",
        data: result.payments,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get teacher's pending dues (payments approved, not yet transferred)
   */
  async getTeacherPendingDues(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const teacherId = (req as any).userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!teacherId) {
        throw new AppError("User ID not found", 401);
      }

      const result = await this.paymentService.getTeacherPendingDues(
        teacherId,
        page,
        limit,
      );

      res.status(200).json({
        success: true,
        message: "Teacher pending dues fetched successfully",
        data: result.pendingPayments,
        summary: {
          totalDue: result.totalDue,
          totalTransactions: result.pagination.total,
        },
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get teacher's completed/paid earnings
   */
  async getTeacherEarnings(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const teacherId = (req as any).userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!teacherId) {
        throw new AppError("User ID not found", 401);
      }

      const result = await this.paymentService.getTeacherEarnings(
        teacherId,
        page,
        limit,
      );

      res.status(200).json({
        success: true,
        message: "Teacher earnings fetched successfully",
        data: result.paidPayments,
        earnings: {
          totalEarnings: result.totalEarnings,
          totalPaidTransactions: result.pagination.total,
        },
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payment by transaction ID
   */
  async getPaymentByTransactionId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { transactionId } = req.params;

      const payment =
        await this.paymentService.getPaymentByTransactionId(transactionId);

      res.status(200).json({
        success: true,
        message: "Payment fetched successfully",
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get admin dashboard stats
   */
  async getAdminStats(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const stats = await this.paymentService.getAdminStats();

      res.status(200).json({
        success: true,
        message: "Admin stats fetched successfully",
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}
