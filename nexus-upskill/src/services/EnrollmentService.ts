import { AppError, ValidationError } from "../utils/errors";
import { EnrollmentRepository } from "../repositories/EnrollmentRepository";
import { CourseRepository } from "../repositories/CourseRepository";
import { PaymentRepository } from "../repositories/PaymentRepository";
import type { IEnrollment } from "../models/Enrollment";

export class EnrollmentService {
  private enrollmentRepository: EnrollmentRepository;
  private courseRepository: CourseRepository;
  private paymentRepository: PaymentRepository;

  constructor() {
    this.enrollmentRepository = new EnrollmentRepository();
    this.courseRepository = new CourseRepository();
    this.paymentRepository = new PaymentRepository();
  }

  /**
   * Enroll student in a course (creates awaiting_admin_approval enrollment)
   */
  async enrollStudent(
    studentId: string,
    courseId: string,
  ): Promise<IEnrollment> {
    // Verify course exists
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new AppError("Course not found", 404);
    }

    if (course.status !== "published") {
      throw new ValidationError("You can only register for published courses");
    }

    // Check if already enrolled or pending
    const existingEnrollment = await this.enrollmentRepository.findByComposite(
      studentId,
      courseId,
    );
    if (existingEnrollment) {
      throw new ValidationError(
        "You already have a pending or active enrollment in this course",
      );
    }

    // Create enrollment with awaiting_admin_approval status.
    const enrollment = await this.enrollmentRepository.create({
      studentId,
      courseId,
      status: "awaiting_admin_approval",
      paymentStatus: "not_requested",
      payableAmount: course.price,
      progress: 0,
    } as any);

    return enrollment;
  }

  /**
   * Get student's enrollments
   */
  async getStudentEnrollments(
    studentId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    enrollments: any[];
    total: number;
    page: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;
    const enrollments = await this.enrollmentRepository.findByStudent(
      studentId,
      skip,
      limit,
    );
    const total = await this.enrollmentRepository.countByStudent(studentId);

    // Add enrollment counts and payment data to each enrolled course
    const enrollmentsWithCounts = await Promise.all(
      enrollments.map(async (enrollment: any) => {
        const courseId =
          enrollment.courseId?._id?.toString() || enrollment.courseId;
        let enrolledCount = 0;

        if (courseId) {
          enrolledCount =
            await this.enrollmentRepository.countByCourseAndStatus(
              courseId,
              "active",
            );
        }

        const enrollmentObj = enrollment.toObject
          ? enrollment.toObject()
          : enrollment;
        if (
          enrollmentObj.courseId &&
          typeof enrollmentObj.courseId === "object"
        ) {
          enrollmentObj.courseId.enrolledCount = enrolledCount;
        }

        // Fetch associated payment if enrollment status is payment_requested or higher
        if (
          enrollment.status === "payment_requested" ||
          enrollment.status === "payment_submitted"
        ) {
          const payment = await this.paymentRepository.findByEnrollmentId(
            enrollment._id.toString(),
          );
          if (payment) {
            enrollmentObj.paymentId = payment._id;
          }
        }

        return enrollmentObj;
      }),
    );

    return {
      enrollments: enrollmentsWithCounts,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Get pending enrollments (Admin)
   */
  async getPendingEnrollments(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    enrollments: IEnrollment[];
    total: number;
    page: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;
    // Use a simple find with status filter instead of a method that doesn't exist
    const enrollments = await this.enrollmentRepository.findByStatus(
      "awaiting_admin_approval",
      skip,
      limit,
    );
    const total = await this.enrollmentRepository.countByStatus(
      "awaiting_admin_approval",
    );

    return {
      enrollments,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Legacy approve enrollment (Admin) - direct activation flow
   */
  async approveEnrollment(enrollmentId: string): Promise<IEnrollment> {
    const enrollment = await this.enrollmentRepository.findById(enrollmentId);
    if (!enrollment) {
      throw new AppError("Enrollment not found", 404);
    }

    if (
      enrollment.status !== "awaiting_admin_approval" &&
      enrollment.status !== "payment_submitted"
    ) {
      throw new ValidationError(
        "Only awaiting admin approval or payment submitted enrollments can be approved",
      );
    }

    // Change status to active (approved)
    const updated = await this.enrollmentRepository.updateById(enrollmentId, {
      status: "active",
      paymentStatus: "paid_to_admin_escrow",
      paymentConfirmedAt: new Date(),
    });

    if (!updated) {
      throw new AppError("Failed to approve enrollment", 500);
    }

    return updated;
  }

  /**
   * Reject student enrollment (Admin)
   */
  async rejectEnrollment(enrollmentId: string, reason?: string): Promise<void> {
    const enrollment = await this.enrollmentRepository.findById(enrollmentId);
    if (!enrollment) {
      throw new AppError("Enrollment not found", 404);
    }

    if (enrollment.status !== "awaiting_admin_approval") {
      throw new ValidationError(
        "Only awaiting admin approval enrollments can be rejected",
      );
    }

    // Update status to rejected and store the reason
    await this.enrollmentRepository.updateById(enrollmentId, {
      status: "rejected",
      rejectionReason: reason || "Rejected by admin",
    } as any);
  }

  /**
   * Get course enrollments (Teacher)
   */
  async getCourseEnrollments(
    courseId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    enrollments: IEnrollment[];
    total: number;
    page: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;
    const enrollments = await this.enrollmentRepository.findByCourse(
      courseId,
      skip,
      limit,
    );
    const total = await this.enrollmentRepository.countByCourse(courseId);

    return {
      enrollments,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Update enrollment progress
   */
  async updateProgress(
    enrollmentId: string,
    studentId: string,
    progress: number,
  ): Promise<IEnrollment> {
    const enrollment = await this.enrollmentRepository.findById(enrollmentId);
    if (!enrollment) {
      throw new AppError("Enrollment not found", 404);
    }

    // Verify ownership
    if (enrollment.studentId.toString() !== studentId) {
      throw new AppError("Unauthorized to update this enrollment", 403);
    }

    // Validate progress
    if (progress < 0 || progress > 100) {
      throw new ValidationError("Progress must be between 0 and 100");
    }

    const updatedEnrollment = await this.enrollmentRepository.updateById(
      enrollmentId,
      { progress },
    );
    if (!updatedEnrollment) {
      throw new AppError("Failed to update enrollment", 500);
    }

    return updatedEnrollment;
  }

  /**
   * Update enrollment status
   */
  async updateStatus(
    enrollmentId: string,
    studentId: string,
    status:
      | "awaiting_admin_approval"
      | "payment_requested"
      | "payment_submitted"
      | "active"
      | "completed"
      | "rejected",
  ): Promise<IEnrollment> {
    const enrollment = await this.enrollmentRepository.findById(enrollmentId);
    if (!enrollment) {
      throw new AppError("Enrollment not found", 404);
    }

    // Verify ownership
    if (enrollment.studentId.toString() !== studentId) {
      throw new AppError("Unauthorized to update this enrollment", 403);
    }

    const updatedEnrollment = await this.enrollmentRepository.updateById(
      enrollmentId,
      { status },
    );
    if (!updatedEnrollment) {
      throw new AppError("Failed to update enrollment", 500);
    }

    return updatedEnrollment;
  }

  /**
   * Mark enrollment as completed
   */
  async completeEnrollment(
    enrollmentId: string,
    studentId: string,
  ): Promise<IEnrollment> {
    const enrollment = await this.enrollmentRepository.findById(enrollmentId);
    if (!enrollment) {
      throw new AppError("Enrollment not found", 404);
    }

    // Verify ownership
    if (enrollment.studentId.toString() !== studentId) {
      throw new AppError("Unauthorized", 403);
    }

    const updatedEnrollment = await this.enrollmentRepository.updateById(
      enrollmentId,
      { status: "completed", progress: 100 },
    );
    if (!updatedEnrollment) {
      throw new AppError("Failed to complete enrollment", 500);
    }

    return updatedEnrollment;
  }

  /**
   * Get enrollment by ID
   */
  async getEnrollmentById(enrollmentId: string): Promise<IEnrollment> {
    const enrollment = await this.enrollmentRepository.findById(enrollmentId);
    if (!enrollment) {
      throw new AppError("Enrollment not found", 404);
    }
    return enrollment;
  }

  /**
   * Get teacher's active students (approved enrollments only)
   */
  async getTeacherStudents(
    teacherId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    students: any[];
    total: number;
    page: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;

    // Get all courses taught by this teacher
    const courses = await this.courseRepository.findByTeacher(teacherId);
    const courseIds: any[] = courses.map((c: any) => c._id);

    if (courseIds.length === 0) {
      return { students: [], total: 0, page, pages: 0 };
    }

    // Get approved enrollments in these courses
    const enrollments = await this.enrollmentRepository.findByCoursesAndStatus(
      courseIds,
      "active",
      skip,
      limit,
    );
    const total = await this.enrollmentRepository.countByCoursesAndStatus(
      courseIds,
      "active",
    );

    // Extract unique students
    const studentsMap = new Map();
    enrollments.forEach((e: any) => {
      if (e.studentId && !studentsMap.has(e.studentId._id.toString())) {
        studentsMap.set(e.studentId._id.toString(), {
          ...e.studentId,
          enrollment: e,
        });
      }
    });

    const students = Array.from(studentsMap.values());

    return {
      students,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Get teacher's courses with enrolled students (admin view)
   */
  async getTeacherCoursesWithStudents(
    teacherId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    courses: any[];
    total: number;
    page: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;

    // Get all courses taught by this teacher
    const courses = await this.courseRepository.findByTeacher(
      teacherId,
      skip,
      limit,
    );
    const total = await this.courseRepository.countByTeacher(teacherId);

    // Enrich courses with active student count
    const coursesWithStudents = await Promise.all(
      courses.map(async (course: any) => {
        const studentCount =
          await this.enrollmentRepository.countByCourseAndStatus(
            course._id.toString(),
            "active",
          );
        return {
          ...course,
          activeStudentCount: studentCount,
        };
      }),
    );

    return {
      courses: coursesWithStudents,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Get all teachers with their courses and active students (Admin only)
   */
  async getAllTeachersWithCourses(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    teachers: any[];
    total: number;
    page: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;

    // We need to use a different approach - get teachers from courses
    const courses = await this.courseRepository.findAll({}, skip, limit);
    const total = await this.courseRepository.countAll();

    // Group by teacher
    const teacherMap = new Map();

    for (const course of courses) {
      const teacherId = course.teacherId.toString();
      if (!teacherMap.has(teacherId)) {
        teacherMap.set(teacherId, {
          teacher: course.teacherId,
          courses: [],
        });
      }

      const teacherData = teacherMap.get(teacherId);
      const studentCount =
        await this.enrollmentRepository.countByCourseAndStatus(
          course._id.toString(),
          "active",
        );

      teacherData.courses.push({
        ...course,
        activeStudentCount: studentCount,
      });
    }

    const teachers = Array.from(teacherMap.values());

    return {
      teachers,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }
}
