import Course, { ICourse } from "../models/Course";
import { ObjectId } from "mongoose";

export class CourseRepository {
  /**
   * Create a new course
   */
  async create(courseData: Partial<ICourse>): Promise<ICourse> {
    const course = new Course(courseData);
    return await course.save();
  }

  /**
   * Find course by ID
   */
  async findById(id: string): Promise<ICourse | null> {
    return await Course.findById(id).populate("teacherId", "-password");
  }

  /**
   * Find all courses with pagination and filters
   */
  async findAll(
    filter: any = {},
    skip: number = 0,
    limit: number = 10,
  ): Promise<ICourse[]> {
    return await Course.find(filter)
      .populate("teacherId", "-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  /**
   * Count all courses with optional filter
   */
  async countAll(filter: any = {}): Promise<number> {
    return await Course.countDocuments(filter);
  }

  /**
   * Find courses by teacher ID
   */
  async findByTeacherId(teacherId: string): Promise<ICourse[]> {
    return await Course.find({ teacherId }).populate("teacherId", "-password");
  }

  /**
   * Find published courses
   */
  async findPublished(): Promise<ICourse[]> {
    return await Course.find({ status: "published" }).populate(
      "teacherId",
      "-password",
    );
  }

  /**
   * Find trending courses
   */
  async findTrending(): Promise<ICourse[]> {
    return await Course.find({
      isTrending: true,
      status: "published",
    }).populate("teacherId", "-password");
  }

  /**
   * Update course
   */
  async updateById(
    id: string,
    updateData: Partial<ICourse>,
  ): Promise<ICourse | null> {
    return await Course.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("teacherId", "-password");
  }

  /**
   * Delete course
   */
  async deleteById(id: string): Promise<boolean> {
    const result = await Course.findByIdAndDelete(id);
    return result !== null;
  }

  /**
   * Toggle trending status (Admin only)
   */
  async toggleTrending(id: string): Promise<ICourse | null> {
    const course = await Course.findById(id);
    if (!course) return null;

    course.isTrending = !course.isTrending;
    return await course.save();
  }

  /**
   * Publish course
   */
  async publish(id: string): Promise<ICourse | null> {
    return await this.updateById(id, { status: "published" });
  }

  /**
   * Find courses by teacher with pagination
   */
  async findByTeacher(
    teacherId: string,
    skip: number = 0,
    limit: number = 10,
  ): Promise<ICourse[]> {
    return await Course.find({ teacherId })
      .populate("teacherId", "-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  /**
   * Count courses by teacher
   */
  async countByTeacher(teacherId: string): Promise<number> {
    return await Course.countDocuments({ teacherId });
  }
}

export default new CourseRepository();
