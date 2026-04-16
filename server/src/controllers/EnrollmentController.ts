import { Request, Response, NextFunction } from "express";
import { EnrollmentService } from "../services/EnrollmentService";
import {
  EnrollSchema,
  UpdateEnrollmentSchema,
} from "../validators/enrollmentValidator";
import { AppError } from "../utils/errors";

export class EnrollmentController {
  private enrollmentService: EnrollmentService;

  constructor() {
    this.enrollmentService = new EnrollmentService();
  }

  /**
   * Enroll student in a course
   */
  async enrollInCourse(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const studentId = (req as any).userId;

      if (!studentId) {
        throw new AppError("User ID not found", 401);
      }

      // Validate request
      const { courseId } = EnrollSchema.parse(req.body);

      // Enroll student
      const enrollment = await this.enrollmentService.enrollStudent(
        studentId,
        courseId,
      );

      res.status(201).json({
        success: true,
        message: "Successfully enrolled in course",
        data: enrollment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get student's enrollments
   */
  async getMyEnrollments(
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

      const result = await this.enrollmentService.getStudentEnrollments(
        studentId,
        page,
        limit,
      );

      res.status(200).json({
        success: true,
        message: "Enrollments fetched successfully",
        data: result.enrollments,
        pagination: {
          total: result.total,
          page: result.page,
          pages: result.pages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get course enrollments (Teacher only)
   */
  async getCourseEnrollments(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { courseId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.enrollmentService.getCourseEnrollments(
        courseId,
        page,
        limit,
      );

      res.status(200).json({
        success: true,
        message: "Course enrollments fetched successfully",
        data: result.enrollments,
        pagination: {
          total: result.total,
          page: result.page,
          pages: result.pages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update enrollment progress
   */
  async updateProgress(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const studentId = (req as any).userId;
      const { enrollmentId } = req.params;

      if (!studentId) {
        throw new AppError("User ID not found", 401);
      }

      // Validate request
      const { progress } = UpdateEnrollmentSchema.parse(req.body);

      // Update progress
      const updatedEnrollment = await this.enrollmentService.updateProgress(
        enrollmentId,
        studentId,
        progress,
      );

      res.status(200).json({
        success: true,
        message: "Progress updated successfully",
        data: updatedEnrollment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update enrollment status
   */
  async updateStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const studentId = (req as any).userId;
      const { enrollmentId } = req.params;

      if (!studentId) {
        throw new AppError("User ID not found", 401);
      }

      // Validate request
      const validatedData = UpdateEnrollmentSchema.parse(req.body);

      if (!validatedData.status) {
        throw new AppError("Status is required", 400);
      }

      // Update status
      const updatedEnrollment = await this.enrollmentService.updateStatus(
        enrollmentId,
        studentId,
        validatedData.status,
      );

      res.status(200).json({
        success: true,
        message: "Status updated successfully",
        data: updatedEnrollment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark enrollment as completed
   */
  async completeEnrollment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const studentId = (req as any).userId;
      const { enrollmentId } = req.params;

      if (!studentId) {
        throw new AppError("User ID not found", 401);
      }

      // Complete enrollment
      const completedEnrollment =
        await this.enrollmentService.completeEnrollment(
          enrollmentId,
          studentId,
        );

      res.status(200).json({
        success: true,
        message: "Enrollment completed successfully",
        data: completedEnrollment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get enrollment by ID
   */
  async getEnrollmentById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { enrollmentId } = req.params;

      const enrollment =
        await this.enrollmentService.getEnrollmentById(enrollmentId);

      res.status(200).json({
        success: true,
        message: "Enrollment fetched successfully",
        data: enrollment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get pending enrollments (Admin only)
   */
  async getPendingEnrollments(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.enrollmentService.getPendingEnrollments(
        page,
        limit,
      );

      res.status(200).json({
        success: true,
        message: "Pending enrollments fetched successfully",
        data: result.enrollments,
        pagination: {
          total: result.total,
          page: result.page,
          pages: result.pages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Approve student enrollment (Admin only)
   */
  async approveEnrollment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { enrollmentId } = req.params;

      const enrollment =
        await this.enrollmentService.approveEnrollment(enrollmentId);

      res.status(200).json({
        success: true,
        message: "Student enrollment approved successfully",
        data: enrollment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reject student enrollment (Admin only)
   */
  async rejectEnrollment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { enrollmentId } = req.params;
      const { reason } = req.body;

      if (!reason) {
        throw new AppError("Rejection reason is required", 400);
      }

      await this.enrollmentService.rejectEnrollment(enrollmentId, reason);

      res.status(200).json({
        success: true,
        message: "Student enrollment rejected successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get teacher's active students (Teacher only)
   */
  async getTeacherStudents(
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

      const result = await this.enrollmentService.getTeacherStudents(
        teacherId,
        page,
        limit,
      );

      res.status(200).json({
        success: true,
        message: "Teacher students fetched successfully",
        data: result.students,
        pagination: {
          total: result.total,
          page: result.page,
          pages: result.pages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get teacher's courses with active students count (Admin only)
   */
  async getTeacherCoursesWithStudents(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { teacherId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.enrollmentService.getTeacherCoursesWithStudents(
        teacherId,
        page,
        limit,
      );

      res.status(200).json({
        success: true,
        message: "Teacher courses fetched successfully",
        data: result.courses,
        pagination: {
          total: result.total,
          page: result.page,
          pages: result.pages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all teachers with their courses and students (Admin only)
   */
  async getAllTeachersWithCourses(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.enrollmentService.getAllTeachersWithCourses(
        page,
        limit,
      );

      res.status(200).json({
        success: true,
        message: "All teachers with courses fetched successfully",
        data: result.teachers,
        pagination: {
          total: result.total,
          page: result.page,
          pages: result.pages,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
