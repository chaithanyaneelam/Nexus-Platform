import Enrollment, { IEnrollment } from "../models/Enrollment";

export class EnrollmentRepository {
  /**
   * Create a new enrollment
   */
  async create(enrollmentData: Partial<IEnrollment>): Promise<IEnrollment> {
    const enrollment = new Enrollment(enrollmentData);
    return await enrollment.save();
  }

  /**
   * Find enrollment by ID
   */
  async findById(id: string): Promise<IEnrollment | null> {
    return await Enrollment.findById(id)
      .populate("studentId", "-password")
      .populate({ path: "courseId", populate: { path: "teacherId", select: "-password" } });
  }

  /**
   * Find enrollment by student and course (composite)
   */
  async findByComposite(
    studentId: string,
    courseId: string,
  ): Promise<IEnrollment | null> {
    return await Enrollment.findOne({ studentId, courseId });
  }

  /**
   * Find enrollments by student ID with pagination
   */
  async findByStudent(
    studentId: string,
    skip: number = 0,
    limit: number = 10,
  ): Promise<IEnrollment[]> {
    return await Enrollment.find({ studentId })
      .populate("studentId", "-password")
      .populate({ path: "courseId", populate: { path: "teacherId", select: "-password" } })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  /**
   * Count enrollments by student ID
   */
  async countByStudent(studentId: string): Promise<number> {
    return await Enrollment.countDocuments({ studentId });
  }

  /**
   * Find enrollments by course ID with pagination
   */
  async findByCourse(
    courseId: string,
    skip: number = 0,
    limit: number = 10,
  ): Promise<IEnrollment[]> {
    return await Enrollment.find({ courseId })
      .populate("studentId", "-password")
      .populate({ path: "courseId", populate: { path: "teacherId", select: "-password" } })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  /**
   * Count enrollments by course ID
   */
  async countByCourse(courseId: string): Promise<number> {
    return await Enrollment.countDocuments({ courseId });
  }

  /**
   * Find enrollment by student and course (legacy)
   */
  async findByStudentAndCourse(
    studentId: string,
    courseId: string,
  ): Promise<IEnrollment | null> {
    return await Enrollment.findOne({ studentId, courseId });
  }

  /**
   * Update enrollment
   */
  async updateById(
    id: string,
    updateData: Partial<IEnrollment>,
  ): Promise<IEnrollment | null> {
    return await Enrollment.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("studentId", "-password")
      .populate({ path: "courseId", populate: { path: "teacherId", select: "-password" } });
  }

  /**
   * Delete enrollment
   */
  async deleteById(id: string): Promise<boolean> {
    const result = await Enrollment.findByIdAndDelete(id);
    return result !== null;
  }

  /**
   * Find all enrollments
   */
  async findAll(): Promise<IEnrollment[]> {
    return await Enrollment.find()
      .populate("studentId", "-password")
      .populate({ path: "courseId", populate: { path: "teacherId", select: "-password" } });
  }

  /**
   * Get enrollment count by course (legacy)
   */
  async getEnrollmentCountByCourse(courseId: string): Promise<number> {
    return await Enrollment.countDocuments({ courseId });
  }

  /**
   * Find enrollments by status with pagination (Admin)
   */
  async findByStatus(
    status: string,
    skip: number = 0,
    limit: number = 10,
  ): Promise<IEnrollment[]> {
    return await Enrollment.find({ status })
      .populate("studentId", "-password")
      .populate({ path: "courseId", populate: { path: "teacherId", select: "-password" } })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  /**
   * Count enrollments by status (Admin)
   */
  async countByStatus(status: string): Promise<number> {
    return await Enrollment.countDocuments({ status });
  }

  /**
   * Find enrollments by multiple courses and status with pagination
   */
  async findByCoursesAndStatus(
    courseIds: any[],
    status: string,
    skip: number = 0,
    limit: number = 10,
  ): Promise<IEnrollment[]> {
    return await Enrollment.find({ courseId: { $in: courseIds }, status })
      .populate("studentId", "-password")
      .populate({ path: "courseId", populate: { path: "teacherId", select: "-password" } })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  /**
   * Count enrollments by multiple courses and status
   */
  async countByCoursesAndStatus(
    courseIds: any[],
    status: string,
  ): Promise<number> {
    return await Enrollment.countDocuments({
      courseId: { $in: courseIds },
      status,
    });
  }

  /**
   * Count enrollments by course and status
   */
  async countByCourseAndStatus(
    courseId: string,
    status: string,
  ): Promise<number> {
    return await Enrollment.countDocuments({ courseId, status });
  }
}

export default new EnrollmentRepository();
