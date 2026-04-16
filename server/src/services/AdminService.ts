import EnrollmentModel from "../models/Enrollment";
import PaymentModel from "../models/Payment";
import UserModel from "../models/User";
import { APP_CONFIG } from "../config/constants";

export class AdminService {
  /**
   * Get all student registration requests waiting for admin review.
   */
  async getPendingEnrollments(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const enrollments = await EnrollmentModel.find({
      status: "awaiting_admin_approval",
    })
      .populate({
        path: "studentId",
        select: "name email mobileNumber interests",
      })
      .populate({
        path: "courseId",
        select: "title price teacherId",
        populate: {
          path: "teacherId",
          select: "name email mobileNumber profession company role",
        },
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await EnrollmentModel.countDocuments({
      status: "awaiting_admin_approval",
    });

    return {
      enrollments,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Admin requests payment from student for an approved registration.
   */
  async requestPayment(enrollmentId: string) {
    const enrollment = await EnrollmentModel.findById(enrollmentId).populate([
      { path: "studentId", select: "name email" },
      { path: "courseId", select: "title price teacherId" },
    ]);

    if (!enrollment) {
      throw new Error("Enrollment not found");
    }

    if (
      enrollment.status === "payment_requested" ||
      enrollment.status === "payment_submitted"
    ) {
      const existingPayment = await PaymentModel.findOne({
        enrollmentId: enrollment._id,
      }).sort({ createdAt: -1 });

      if (!existingPayment) {
        throw new Error(
          "Payment state found on enrollment but payment record is missing. Please contact support.",
        );
      }

      return {
        enrollment,
        payment: {
          _id: existingPayment._id,
          amount: existingPayment.amount,
          status: existingPayment.status,
          adminUpiId: existingPayment.adminUpiId,
          message: `Payment already requested. Student should pay ${existingPayment.amount} to ${existingPayment.adminUpiId}`,
        },
      };
    }

    if (enrollment.status !== "awaiting_admin_approval") {
      throw new Error(
        `Enrollment is ${enrollment.status}. Payment request is only allowed from awaiting_admin_approval.`,
      );
    }

    const existingPendingPayment = await PaymentModel.findOne({
      enrollmentId: enrollment._id,
      status: {
        $in: ["payment_requested", "transaction_submitted", "approved"],
      },
    }).sort({ createdAt: -1 });

    if (existingPendingPayment) {
      enrollment.status =
        existingPendingPayment.status === "transaction_submitted"
          ? "payment_submitted"
          : "payment_requested";
      enrollment.paymentStatus =
        existingPendingPayment.status === "transaction_submitted"
          ? ("payment_submitted" as any)
          : ("payment_requested" as any);
      enrollment.paymentRequestedAt =
        enrollment.paymentRequestedAt || new Date();
      await enrollment.save();

      return {
        enrollment,
        payment: {
          _id: existingPendingPayment._id,
          amount: existingPendingPayment.amount,
          status: existingPendingPayment.status,
          adminUpiId: existingPendingPayment.adminUpiId,
          message: `Payment request already exists for this enrollment.`,
        },
      };
    }

    const course = enrollment.courseId as any;
    const amount = Number(course.price || 0);
    const adminCommission = Math.round(
      amount * (APP_CONFIG.PAYMENT_COMMISSION_PERCENTAGE / 100),
    );
    const teacherPayment = amount - adminCommission;

    enrollment.status = "payment_requested";
    enrollment.paymentStatus = "payment_requested" as any;
    enrollment.payableAmount = amount;
    enrollment.adminApprovedAt = new Date();
    enrollment.paymentRequestedAt = new Date();
    enrollment.platformFeePercentage = APP_CONFIG.PAYMENT_COMMISSION_PERCENTAGE;
    enrollment.platformFeeAmount = adminCommission;
    enrollment.teacherSettlementAmount = teacherPayment;
    await enrollment.save();

    const payment = new PaymentModel({
      studentId: enrollment.studentId,
      teacherId: course.teacherId,
      courseId: enrollment.courseId,
      enrollmentId: enrollment._id,
      amount,
      adminCommission,
      teacherPayment,
      status: "payment_requested",
      adminUpiId: APP_CONFIG.ADMIN_UPI_ID,
      adminRequestedAt: new Date(),
    });

    await payment.save();

    return {
      enrollment,
      payment: {
        _id: payment._id,
        amount: payment.amount,
        status: payment.status,
        adminUpiId: payment.adminUpiId,
        message: `Pay the amount ${payment.amount} to ${payment.adminUpiId}`,
      },
    };
  }

  /**
   * Backward compatible alias for legacy route naming.
   */
  async approveEnrollment(enrollmentId: string) {
    return this.requestPayment(enrollmentId);
  }

  async rejectEnrollment(enrollmentId: string, reason: string) {
    const enrollment = await EnrollmentModel.findById(enrollmentId);

    if (!enrollment) {
      throw new Error("Enrollment not found");
    }

    if (enrollment.status !== "awaiting_admin_approval") {
      throw new Error(`Enrollment is ${enrollment.status}. Cannot reject.`);
    }

    enrollment.status = "rejected";
    enrollment.rejectionReason = reason;
    await enrollment.save();

    return enrollment;
  }

  async getPendingPayments(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const payments = await PaymentModel.find({
      status: { $in: ["payment_requested", "transaction_submitted"] },
    })
      .populate({ path: "studentId", select: "name email mobileNumber" })
      .populate({ path: "teacherId", select: "name upiId mobileNumber" })
      .populate({ path: "courseId", select: "title price" })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await PaymentModel.countDocuments({
      status: { $in: ["payment_requested", "transaction_submitted"] },
    });

    return {
      payments,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getTeacherDues(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const payments = await PaymentModel.find({
      status: "approved",
    })
      .populate({ path: "studentId", select: "name email mobileNumber" })
      .populate({ path: "teacherId", select: "name upiId mobileNumber" })
      .populate({ path: "courseId", select: "title price" })
      .skip(skip)
      .limit(limit)
      .sort({ adminApprovedAt: -1 });

    const total = await PaymentModel.countDocuments({
      status: "approved",
    });

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
   * Admin confirms payment receipt (escrow credited) and activates enrollment.
   */
  async approvePayment(paymentId: string, adminId?: string) {
    const payment = await PaymentModel.findById(paymentId).populate([
      { path: "studentId", select: "name email" },
      { path: "teacherId", select: "name upiId" },
      { path: "courseId", select: "title price" },
    ]);

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.status !== "transaction_submitted") {
      throw new Error(
        `Cannot approve payment with status: ${payment.status}. Expected: transaction_submitted`,
      );
    }

    if (!payment.transactionId) {
      throw new Error("Transaction ID is required before admin approval.");
    }

    payment.status = "approved";
    payment.adminApprovedAt = new Date();
    await payment.save();

    if (adminId) {
      const admin = await UserModel.findById(adminId);
      if (admin) {
        admin.adminEscrowBalance =
          (admin.adminEscrowBalance || 0) + payment.amount;
        await admin.save();
      }
    }

    const enrollment = await EnrollmentModel.findById(payment.enrollmentId);
    if (enrollment) {
      enrollment.status = "active";
      enrollment.paymentStatus = "paid_to_admin_escrow" as any;
      enrollment.paymentConfirmedAt = new Date();
      enrollment.platformFeeAmount = payment.adminCommission;
      enrollment.teacherSettlementAmount = payment.teacherPayment;
      await enrollment.save();
    }

    return {
      payment: {
        _id: payment._id,
        studentId: (payment.studentId as any).name,
        courseId: (payment.courseId as any).title,
        amount: payment.amount,
        adminCommission: payment.adminCommission,
        teacherPayment: payment.teacherPayment,
        transactionId: payment.transactionId,
        status: payment.status,
      },
      enrollment,
    };
  }

  async rejectPayment(paymentId: string, reason: string) {
    const payment = await PaymentModel.findById(paymentId);

    if (!payment) {
      throw new Error("Payment not found");
    }

    payment.status = "rejected";
    payment.rejectionReason = reason;
    await payment.save();

    const enrollment = await EnrollmentModel.findById(payment.enrollmentId);
    if (enrollment) {
      enrollment.status = "payment_requested";
      enrollment.paymentStatus = "payment_requested" as any;
      await enrollment.save();
    }

    return { payment, enrollment };
  }

  /**
   * Settlement: release escrow to teacher and mark settlement complete.
   */
  async settleTeacherPayment(paymentId: string, adminId?: string) {
    const payment = await PaymentModel.findById(paymentId);

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.status !== "approved") {
      throw new Error("Payment must be approved before settlement");
    }

    payment.status = "paid_to_teacher";
    payment.paidToTeacherAt = new Date();
    await payment.save();

    const teacher = await UserModel.findById(payment.teacherId);
    if (teacher) {
      teacher.teacherWalletBalance =
        (teacher.teacherWalletBalance || 0) + payment.teacherPayment;
      await teacher.save();
    }

    if (adminId) {
      const admin = await UserModel.findById(adminId);
      if (admin) {
        admin.adminEscrowBalance = Math.max(
          0,
          (admin.adminEscrowBalance || 0) - payment.teacherPayment,
        );
        await admin.save();
      }
    }

    const enrollment = await EnrollmentModel.findById(payment.enrollmentId);
    if (enrollment) {
      enrollment.adminSettled = true;
      enrollment.settledAt = new Date();
      enrollment.paymentStatus = "settled_to_teacher" as any;
      await enrollment.save();
    }

    return payment;
  }

  /**
   * Backward compatible alias for existing route naming.
   */
  async markAsPaidToTeacher(paymentId: string, adminId?: string) {
    return this.settleTeacherPayment(paymentId, adminId);
  }

  async getAdminDashboardStats() {
    const [
      pendingEnrollments,
      pendingPayments,
      approvedPayments,
      paidToTeacherPayments,
      rejectedPayments,
    ] = await Promise.all([
      EnrollmentModel.countDocuments({ status: "awaiting_admin_approval" }),
      PaymentModel.countDocuments({
        status: { $in: ["payment_requested", "transaction_submitted"] },
      }),
      PaymentModel.countDocuments({ status: "approved" }),
      PaymentModel.countDocuments({ status: "paid_to_teacher" }),
      PaymentModel.countDocuments({ status: "rejected" }),
    ]);

    const approvedPaymentsData = await PaymentModel.find({
      status: "approved",
    });
    const paidPaymentsData = await PaymentModel.find({
      status: "paid_to_teacher",
    });

    const totalCommissionEarned = [
      ...approvedPaymentsData,
      ...paidPaymentsData,
    ].reduce((sum, p) => sum + p.adminCommission, 0);

    const pendingTeacherPayments = approvedPaymentsData.reduce(
      (sum, p) => sum + p.teacherPayment,
      0,
    );

    return {
      pendingEnrollments,
      pendingPayments,
      approvedPayments,
      paidToTeacherPayments,
      rejectedPayments,
      totalCommissionEarned,
      pendingTeacherPayments,
    };
  }

  async getAllUsers(role?: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const query = role ? { role } : {};

    const users = await UserModel.find(query)
      .select(
        "name email role profession company interests mobileNumber linkedinUrl githubUrl",
      )
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await UserModel.countDocuments(query);

    return {
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getUserDetails(userId: string) {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async getTeacherPendingDues(teacherId: string) {
    const pendingPayments = await PaymentModel.find({
      teacherId,
      status: { $in: ["approved"] },
    })
      .populate("courseId", "title")
      .populate("studentId", "name email");

    const totalDue = pendingPayments.reduce(
      (sum, p) => sum + p.teacherPayment,
      0,
    );

    return {
      pendingPayments,
      totalDue,
    };
  }
}

export default new AdminService();
