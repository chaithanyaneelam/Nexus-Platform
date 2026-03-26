import Payment, { IPayment } from "../models/Payment";

export class PaymentRepository {
  /**
   * Create a new payment
   */
  async create(paymentData: Partial<IPayment>): Promise<IPayment> {
    const payment = new Payment(paymentData);
    return await payment.save();
  }

  /**
   * Find payment by ID
   */
  async findById(id: string): Promise<IPayment | null> {
    return await Payment.findById(id)
      .populate("studentId", "-password")
      .populate("teacherId", "-password")
      .populate("courseId")
      .populate("enrollmentId");
  }

  /**
   * Find payment by transaction ID
   */
  async findByTransactionId(transactionId: string): Promise<IPayment | null> {
    return await Payment.findOne({ transactionId });
  }

  /**
   * Find payments by student ID
   */
  async findByStudentId(studentId: string): Promise<IPayment[]> {
    return await Payment.find({ studentId })
      .populate("studentId", "-password")
      .populate("teacherId", "-password")
      .populate("courseId")
      .populate("enrollmentId");
  }

  /**
   * Find payments by teacher ID
   */
  async findByTeacherId(teacherId: string): Promise<IPayment[]> {
    return await Payment.find({ teacherId })
      .populate("studentId", "-password")
      .populate("teacherId", "-password")
      .populate("courseId")
      .populate("enrollmentId");
  }

  /**
   * Find payments by status with pagination
   */
  async findByStatus(
    status: string,
    skip: number = 0,
    limit: number = 10,
  ): Promise<IPayment[]> {
    return await Payment.find({ status })
      .populate("studentId", "-password")
      .populate("teacherId", "-password")
      .populate("courseId")
      .populate("enrollmentId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  /**
   * Count payments by status
   */
  async countByStatus(status: string): Promise<number> {
    return await Payment.countDocuments({ status });
  }

  /**
   * Find payments by student with pagination
   */
  async findByStudent(
    studentId: string,
    skip: number = 0,
    limit: number = 10,
  ): Promise<IPayment[]> {
    return await Payment.find({ studentId })
      .populate("studentId", "-password")
      .populate("teacherId", "-password")
      .populate("courseId")
      .populate("enrollmentId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  /**
   * Count payments by student
   */
  async countByStudent(studentId: string): Promise<number> {
    return await Payment.countDocuments({ studentId });
  }

  /**
   * Find payments by teacher with pagination
   */
  async findByTeacher(
    teacherId: string,
    skip: number = 0,
    limit: number = 10,
  ): Promise<IPayment[]> {
    return await Payment.find({ teacherId })
      .populate("studentId", "-password")
      .populate("teacherId", "-password")
      .populate("courseId")
      .populate("enrollmentId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  /**
   * Count payments by teacher
   */
  async countByTeacher(teacherId: string): Promise<number> {
    return await Payment.countDocuments({ teacherId });
  }

  /**
   * Find all payments with optional filter and pagination
   */
  async findAll(
    filter: any = {},
    skip: number = 0,
    limit: number = Number.MAX_SAFE_INTEGER,
  ): Promise<IPayment[]> {
    return await Payment.find(filter)
      .populate("studentId", "-password")
      .populate("teacherId", "-password")
      .populate("courseId")
      .populate("enrollmentId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  /**
   * Update payment
   */
  async updateById(
    id: string,
    updateData: Partial<IPayment>,
  ): Promise<IPayment | null> {
    return await Payment.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("studentId", "-password")
      .populate("teacherId", "-password")
      .populate("courseId")
      .populate("enrollmentId");
  }

  /**
   * Delete payment
   */
  async deleteById(id: string): Promise<boolean> {
    const result = await Payment.findByIdAndDelete(id);
    return result !== null;
  }

  /**
   * Find pending admin payments
   */
  async findPendingAdmin(): Promise<IPayment[]> {
    return await Payment.find({ status: "payment_requested" })
      .populate("studentId", "-password")
      .populate("teacherId", "-password")
      .populate("courseId")
      .populate("enrollmentId");
  }

  /**
   * Get total payments to teacher
   */
  async getTotalPaymentsToTeacher(teacherId: string): Promise<number> {
    const result = await Payment.aggregate([
      { $match: { teacherId: require("mongoose").Types.ObjectId(teacherId) } },
      { $group: { _id: null, total: { $sum: "$teacherPayment" } } },
    ]);

    return result.length > 0 ? result[0].total : 0;
  }

  /**
   * Get total admin commission
   */
  async getTotalAdminCommission(): Promise<number> {
    const result = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$adminCommission" } } },
    ]);

    return result.length > 0 ? result[0].total : 0;
  }
}

export default new PaymentRepository();
