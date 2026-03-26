import { AppError, ValidationError } from "../utils/errors";
import { PaymentRepository } from "../repositories/PaymentRepository";
import { EnrollmentRepository } from "../repositories/EnrollmentRepository";
import { CourseRepository } from "../repositories/CourseRepository";
import type { IPayment } from "../models/Payment";

export class PaymentService {
  private paymentRepository: PaymentRepository;
  private enrollmentRepository: EnrollmentRepository;
  private courseRepository: CourseRepository;

  constructor() {
    this.paymentRepository = new PaymentRepository();
    this.enrollmentRepository = new EnrollmentRepository();
    this.courseRepository = new CourseRepository();
  }

  /**
   * Get payment requests for student (payments awaiting transaction ID submission)
   */
  async getPaymentRequests(
    studentId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    let payments: IPayment[] = [];
    let total = 0;

    // This is a workaround since PaymentRepository might not have all methods
    try {
      const allPayments = await this.paymentRepository.findAll({}, 0, 999);
      total = allPayments.filter(
        (p) =>
          p.studentId.toString() === studentId &&
          p.status === "payment_requested",
      ).length;
      payments = allPayments
        .filter(
          (p) =>
            p.studentId.toString() === studentId &&
            p.status === "payment_requested",
        )
        .slice(skip, skip + limit);
    } catch (error) {
      total = 0;
      payments = [];
    }

    return {
      payments: payments.map((p) => ({
        _id: p._id,
        courseId: p.courseId,
        amount: p.amount,
        adminUpiId: p.adminUpiId,
        status: p.status,
        adminRequestedAt: p.adminRequestedAt,
        message: `Please pay ₹${p.amount} to ${p.adminUpiId} and submit the transaction ID below`,
      })),
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Student submits transaction ID after paying
   */
  async submitTransactionId(
    paymentId: string,
    studentId: string,
    transactionId: string,
  ): Promise<IPayment> {
    const payment = await this.paymentRepository.findById(paymentId);

    if (!payment) {
      throw new AppError("Payment request not found", 404);
    }

    if (payment.studentId.toString() !== studentId) {
      throw new AppError(
        "You can only submit transaction ID for your own payments",
        403,
      );
    }

    if (payment.status !== "payment_requested") {
      throw new ValidationError(
        `Cannot submit transaction ID for payment with status: ${payment.status}`,
      );
    }

    // Check if transaction ID already exists
    const existingPayment =
      await this.paymentRepository.findByTransactionId(transactionId);
    if (existingPayment && existingPayment._id.toString() !== paymentId) {
      throw new ValidationError(
        "This transaction ID has already been submitted",
      );
    }

    // Update payment
    payment.transactionId = transactionId;
    payment.status = "transaction_submitted";
    payment.transactionSubmittedAt = new Date();
    await payment.save();

    const enrollment = await this.enrollmentRepository.findById(
      payment.enrollmentId.toString(),
    );
    if (enrollment) {
      enrollment.status = "payment_submitted" as any;
      enrollment.paymentStatus = "payment_submitted" as any;
      await enrollment.save();
    }

    return payment;
  }

  /**
   * Get student's payment history
   */
  async getStudentPayments(
    studentId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    let payments: IPayment[] = [];
    let total = 0;

    try {
      const allPayments = await this.paymentRepository.findAll({}, 0, 999);
      const studentPayments = allPayments.filter(
        (p) => p.studentId.toString() === studentId,
      );
      total = studentPayments.length;
      payments = studentPayments.slice(skip, skip + limit);
    } catch (error) {
      total = 0;
      payments = [];
    }

    return {
      payments,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get teacher's pending dues (payments approved but not yet transferred)
   */
  async getTeacherPendingDues(
    teacherId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    let pendingPayments: IPayment[] = [];
    let total = 0;

    try {
      const allPayments = await this.paymentRepository.findAll({}, 0, 999);
      const teacherPayments = allPayments.filter(
        (p) => p.teacherId.toString() === teacherId && p.status === "approved",
      );
      total = teacherPayments.length;
      pendingPayments = teacherPayments.slice(skip, skip + limit);
    } catch (error) {
      total = 0;
      pendingPayments = [];
    }

    const totalDue = pendingPayments.reduce(
      (sum, p) => sum + p.teacherPayment,
      0,
    );

    return {
      pendingPayments,
      totalDue,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get teacher's completed/paid earnings
   */
  async getTeacherEarnings(
    teacherId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    let paidPayments: IPayment[] = [];
    let total = 0;

    try {
      const allPayments = await this.paymentRepository.findAll({}, 0, 999);
      const teacherPayments = allPayments.filter(
        (p) =>
          p.teacherId.toString() === teacherId &&
          p.status === "paid_to_teacher",
      );
      total = teacherPayments.length;
      paidPayments = teacherPayments.slice(skip, skip + limit);
    } catch (error) {
      total = 0;
      paidPayments = [];
    }

    const totalEarnings = paidPayments.reduce(
      (sum, p) => sum + p.teacherPayment,
      0,
    );

    return {
      paidPayments,
      totalEarnings,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get payment by transaction ID
   */
  async getPaymentByTransactionId(transactionId: string): Promise<IPayment> {
    const payment =
      await this.paymentRepository.findByTransactionId(transactionId);
    if (!payment) {
      throw new AppError("Payment not found", 404);
    }
    return payment;
  }

  /**
   * Get admin dashboard stats
   */
  async getAdminStats() {
    let allPayments: IPayment[] = [];
    try {
      allPayments = await this.paymentRepository.findAll({}, 0, 999);
    } catch (error) {
      allPayments = [];
    }

    const totalRevenue = allPayments
      .filter((p) => p.status === "paid_to_teacher")
      .reduce((sum, p) => sum + p.adminCommission, 0);

    const pendingApproval = allPayments
      .filter((p) => p.status === "transaction_submitted")
      .reduce((sum, p) => sum + p.adminCommission, 0);

    const readyToPay = allPayments
      .filter((p) => p.status === "approved")
      .reduce((sum, p) => sum + p.teacherPayment, 0);

    return {
      totalRevenue,
      pendingApproval,
      readyToPay,
      totalTransactions: allPayments.length,
      byStatus: {
        payment_requested: allPayments.filter(
          (p) => p.status === "payment_requested",
        ).length,
        transaction_submitted: allPayments.filter(
          (p) => p.status === "transaction_submitted",
        ).length,
        approved: allPayments.filter((p) => p.status === "approved").length,
        paid_to_teacher: allPayments.filter(
          (p) => p.status === "paid_to_teacher",
        ).length,
        rejected: allPayments.filter((p) => p.status === "rejected").length,
      },
    };
  }
}

export default new PaymentService();
