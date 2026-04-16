import { Request, Response, NextFunction } from "express";
import { CourseService } from "../services/CourseService";
import {
  CreateCourseSchema,
  UpdateCourseSchema,
  PublishCourseSchema,
  ToggleTrendingSchema,
} from "../validators/courseValidator";
import { AppError } from "../utils/errors";

export class CourseController {
  private courseService: CourseService;

  constructor() {
    this.courseService = new CourseService();
  }

  /**
   * Create a new course (Teacher only)
   */
  async createCourse(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const teacherId = (req as any).userId;

      if (!teacherId) {
        throw new AppError("User ID not found", 401);
      }

      // Validate request
      const validatedData = CreateCourseSchema.parse(req.body);

      // Create course
      const course = await this.courseService.createCourse(
        teacherId,
        validatedData,
      );

      res.status(201).json({
        success: true,
        message: "Course created successfully",
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all published courses with pagination
   */
  async getAllCourses(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const isTrending = req.query.trending === "true";

      const filter = isTrending ? { isTrending: true } : undefined;

      const result = await this.courseService.getAllCourses(
        page,
        limit,
        filter,
      );

      res.status(200).json({
        success: true,
        message: "Courses fetched successfully",
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
   * Get course by ID
   */
  async getCourseById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { courseId } = req.params;

      const course = await this.courseService.getCourseById(courseId);

      res.status(200).json({
        success: true,
        message: "Course fetched successfully",
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get teacher's courses
   */
  async getTeacherCourses(
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

      const result = await this.courseService.getTeacherCourses(
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
   * Update course (Teacher only)
   */
  async updateCourse(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const teacherId = (req as any).userId;
      const { courseId } = req.params;

      if (!teacherId) {
        throw new AppError("User ID not found", 401);
      }

      // Validate request
      const validatedData = UpdateCourseSchema.parse(req.body);

      // Update course
      const updatedCourse = await this.courseService.updateCourse(
        courseId,
        teacherId,
        validatedData,
      );

      res.status(200).json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete course (Teacher only)
   */
  async deleteCourse(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const teacherId = (req as any).userId;
      const { courseId } = req.params;

      if (!teacherId) {
        throw new AppError("User ID not found", 401);
      }

      // Delete course
      await this.courseService.deleteCourse(courseId, teacherId);

      res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Publish/Unpublish course (Teacher only)
   */
  async publishCourse(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const teacherId = (req as any).userId;
      const { courseId } = req.params;

      if (!teacherId) {
        throw new AppError("User ID not found", 401);
      }

      // Validate request
      const { status } = PublishCourseSchema.parse(req.body);

      // Publish course
      const updatedCourse = await this.courseService.publishCourse(
        courseId,
        teacherId,
        status,
      );

      res.status(200).json({
        success: true,
        message: `Course ${status} successfully`,
        data: updatedCourse,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Toggle trending status (Admin only)
   */
  async toggleTrending(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { courseId } = req.params;

      // Validate request
      const { isTrending } = ToggleTrendingSchema.parse(req.body);

      // Toggle trending
      const updatedCourse = await this.courseService.toggleTrending(
        courseId,
        isTrending,
      );

      res.status(200).json({
        success: true,
        message: "Course trending status updated",
        data: updatedCourse,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get trending courses
   */
  async getTrendingCourses(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;

      const courses = await this.courseService.getTrendingCourses(limit);

      res.status(200).json({
        success: true,
        message: "Trending courses fetched successfully",
        data: courses,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get pending courses (Admin only)
   */
  async getPendingCourses(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.courseService.getPendingCourses(page, limit);

      res.status(200).json({
        success: true,
        message: "Pending courses fetched successfully",
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
   * Approve course (Admin only)
   */
  async approveCourse(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { courseId } = req.params;

      const approvedCourse = await this.courseService.approveCourse(courseId);

      res.status(200).json({
        success: true,
        message: "Course approved successfully",
        data: approvedCourse,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reject course (Admin only)
   */
  async rejectCourse(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { courseId } = req.params;

      await this.courseService.rejectCourse(courseId);

      res.status(200).json({
        success: true,
        message: "Course rejected successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
