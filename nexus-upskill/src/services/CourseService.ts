import { AppError, ValidationError } from "../utils/errors";
import { CourseRepository } from "../repositories/CourseRepository";
import { EnrollmentRepository } from "../repositories/EnrollmentRepository";
import type { ICourse } from "../models/Course";
import mongoose from "mongoose";

export class CourseService {
  private courseRepository: CourseRepository;
  private enrollmentRepository: EnrollmentRepository;

  constructor() {
    this.courseRepository = new CourseRepository();
    this.enrollmentRepository = new EnrollmentRepository();
  }

  /**
   * Helper to safely extract string ID from an object or string
   */
  private extractId(id: any): string {
    if (!id) return "";
    if (typeof id === "object") {
      return (id._id || id.id || id).toString();
    }
    return String(id).trim();
  }

  /**
   * Validate and extract ObjectId safely
   */
  private validateObjectId(id: any, label: string): string {
    const idString = this.extractId(id);

    if (!idString) {
      throw new ValidationError(`${label} is required`);
    }

    if (!mongoose.Types.ObjectId.isValid(idString)) {
      throw new ValidationError(`Invalid ${label} format`);
    }

    return idString;
  }

  /**
   * Create a new course
   */
  async createCourse(
    teacherId: string,
    data: {
      title: string;
      description: string;
      duration: number;
      price: number;
      highlights: string[];
      isTrending?: boolean;
      status?: "pending_admin_approval" | "published" | "rejected";
    },
  ): Promise<ICourse> {
    const validTeacherId = this.extractId(teacherId);
    const courseData = {
      ...data,
      teacherId: validTeacherId,
      isTrending: data.isTrending ?? false,
      // Teacher submissions always require admin approval before publication.
      status: "pending_admin_approval",
    };

    return await this.courseRepository.create(courseData as any);
  }

  /**
   * Get all courses with pagination
   */
  async getAllCourses(
    page: number = 1,
    limit: number = 10,
    filter?: {
      status?: string;
      isTrending?: boolean;
      teacherId?: string;
    },
  ): Promise<{
    courses: any[];
    total: number;
    page: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;

    let query: any = { status: "published" }; // Only show published courses to students

    if (filter?.isTrending !== undefined) {
      query.isTrending = filter.isTrending;
    }
    if (filter?.teacherId) {
      query.teacherId = this.extractId(filter.teacherId);
    }

    const courses = await this.courseRepository.findAll(query, skip, limit);
    const total = await this.courseRepository.countAll(query);

    // Add enrollment counts to each course
    const coursesWithCounts = await Promise.all(
      courses.map(async (course: any) => {
        const enrollmentCount =
          await this.enrollmentRepository.countByCourseAndStatus(
            course._id.toString(),
            "active",
          );
        return {
          ...(course.toObject ? course.toObject() : course),
          enrolledCount: enrollmentCount,
        };
      }),
    );

    return {
      courses: coursesWithCounts,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Get course by ID
   */
  async getCourseById(courseId: string): Promise<any> {
    const validatedCourseId = this.validateObjectId(courseId, "Course ID");

    const course = await this.courseRepository.findById(validatedCourseId);
    if (!course) {
      throw new AppError("Course not found", 404);
    }

    // Add enrollment count
    const enrollmentCount =
      await this.enrollmentRepository.countByCourseAndStatus(
        validatedCourseId,
        "active",
      );

    return {
      ...(course.toObject ? course.toObject() : course),
      enrolledCount: enrollmentCount,
    };
  }

  /**
   * Get teacher's courses
   */
  async getTeacherCourses(
    teacherId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    courses: any[];
    total: number;
    page: number;
    pages: number;
  }> {
    const { ObjectId } = require("mongoose").Types;
    const skip = (page - 1) * limit;

    // Convert teacherId string to ObjectId for proper comparison
    const validTeacherIdStr = this.extractId(teacherId);
    const teacherObjectId = new ObjectId(validTeacherIdStr);

    const courses = await this.courseRepository.findAll(
      { teacherId: teacherObjectId },
      skip,
      limit,
    );
    const total = await this.courseRepository.countAll({
      teacherId: teacherObjectId,
    });

    // Optimize: Get enrollment counts in a single aggregation query instead of N+1 queries
    const courseIds = courses.map((c: any) => c._id);
    const enrollmentCounts =
      await this.enrollmentRepository.countMultipleByCourseAndStatus(
        courseIds,
        "active",
      );

    const enrollmentMap = enrollmentCounts.reduce((acc: any, item: any) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {});

    // Add enrollment counts to each course
    const coursesWithCounts = courses.map((course: any) => ({
      ...(course.toObject ? course.toObject() : course),
      enrolledCount: enrollmentMap[course._id.toString()] || 0,
    }));

    return {
      courses: coursesWithCounts,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Update course
   */
  async updateCourse(
    courseId: string,
    teacherId: string,
    data: {
      title?: string;
      description?: string;
      duration?: number;
      price?: number;
      highlights?: string[];
      status?: "pending_admin_approval" | "published" | "rejected";
    },
  ): Promise<ICourse> {
    const validCourseId = this.validateObjectId(courseId, "Course ID");
    const validTeacherId = this.extractId(teacherId);

    const course = await this.courseRepository.findById(validCourseId);
    if (!course) {
      throw new AppError("Course not found", 404);
    }

    // Verify teacher owns this course (Extract both IDs robustly to prevent mismatch)
    const ownerId = this.extractId(course.teacherId);
    if (ownerId !== validTeacherId) {
      throw new AppError("Unauthorized to update this course", 403);
    }

    const updatedCourse = await this.courseRepository.updateById(
      validCourseId,
      data,
    );
    if (!updatedCourse) {
      throw new AppError("Failed to update course", 500);
    }

    return updatedCourse;
  }

  /**
   * Delete course
   */
  async deleteCourse(courseId: string, teacherId: string): Promise<void> {
    const validCourseId = this.validateObjectId(courseId, "Course ID");
    const validTeacherId = this.extractId(teacherId);

    const course = await this.courseRepository.findById(validCourseId);
    if (!course) {
      throw new AppError("Course not found", 404);
    }

    // Verify teacher owns this course
    const ownerId = this.extractId(course.teacherId);
    if (ownerId !== validTeacherId) {
      throw new AppError("Unauthorized to delete this course", 403);
    }

    await this.courseRepository.deleteById(validCourseId);
  }

  /**
   * Publish/Unpublish course (Teacher)
   */
  async publishCourse(
    courseId: string,
    teacherId: string,
    status: "pending_admin_approval",
  ): Promise<ICourse> {
    const validCourseId = this.validateObjectId(courseId, "Course ID");
    const validTeacherId = this.extractId(teacherId);

    const course = await this.courseRepository.findById(validCourseId);
    if (!course) {
      throw new AppError("Course not found", 404);
    }

    // Verify teacher owns this course
    const ownerId = this.extractId(course.teacherId);
    if (ownerId !== validTeacherId) {
      throw new AppError("Unauthorized to modify this course", 403);
    }

    if (course.status === "published") {
      throw new AppError(
        "Published courses cannot be resubmitted directly by teacher",
        400,
      );
    }

    const updatedCourse = await this.courseRepository.updateById(
      validCourseId,
      {
        status,
      },
    );
    if (!updatedCourse) {
      throw new AppError("Failed to update course status", 500);
    }

    return updatedCourse;
  }

  /**
   * Toggle trending status (Admin only)
   */
  async toggleTrending(
    courseId: string,
    isTrending: boolean,
  ): Promise<ICourse> {
    const validCourseId = this.validateObjectId(courseId, "Course ID");

    const course = await this.courseRepository.findById(validCourseId);
    if (!course) {
      throw new AppError("Course not found", 404);
    }

    const updatedCourse = await this.courseRepository.updateById(
      validCourseId,
      {
        isTrending,
      },
    );
    if (!updatedCourse) {
      throw new AppError("Failed to update course", 500);
    }

    return updatedCourse;
  }

  /**
   * Get trending courses
   */
  async getTrendingCourses(limit: number = 10): Promise<ICourse[]> {
    return await this.courseRepository.findAll(
      { isTrending: true, status: "published" },
      0,
      limit,
    );
  }

  /**
   * Get pending courses (submitted by teacher and waiting for admin approval)
   */
  async getPendingCourses(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    courses: ICourse[];
    total: number;
    page: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;
    const courses = await this.courseRepository.findAll(
      { status: "pending_admin_approval" },
      skip,
      limit,
    );
    const total = await this.courseRepository.countAll({
      status: "pending_admin_approval",
    });

    return {
      courses,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Approve course (Admin only) - Change status from pending_admin_approval to published
   */
  async approveCourse(courseId: string): Promise<ICourse> {
    const validCourseId = this.validateObjectId(courseId, "Course ID");

    const course = await this.courseRepository.findById(validCourseId);
    if (!course) {
      throw new AppError("Course not found", 404);
    }

    if (course.status !== "pending_admin_approval") {
      throw new AppError(
        "Only pending admin approval courses can be approved",
        400,
      );
    }

    const updatedCourse = await this.courseRepository.updateById(
      validCourseId,
      {
        status: "published",
      },
    );
    if (!updatedCourse) {
      throw new AppError("Failed to approve course", 500);
    }

    return updatedCourse;
  }

  /**
   * Reject course (Admin only) - Keep course but mark rejected
   */
  async rejectCourse(courseId: string): Promise<void> {
    const validCourseId = this.validateObjectId(courseId, "Course ID");

    const course = await this.courseRepository.findById(validCourseId);
    if (!course) {
      throw new AppError("Course not found", 404);
    }

    if (course.status !== "pending_admin_approval") {
      throw new AppError(
        "Only pending admin approval courses can be rejected",
        400,
      );
    }

    const updatedCourse = await this.courseRepository.updateById(
      validCourseId,
      {
        status: "rejected",
      },
    );

    if (!updatedCourse) {
      throw new AppError("Failed to reject course", 500);
    }
  }
}
