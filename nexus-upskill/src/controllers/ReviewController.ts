import { Request, Response } from "express";
import mongoose from "mongoose";
import Review from "../models/Review";
import User from "../models/User";
import Enrollment from "../models/Enrollment";
import Course from "../models/Course";

export class ReviewController {
  public static async submitReview(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;
      let { courseId, teacherId, rating, experience } = req.body;

      if (!studentId || !courseId || !teacherId || !rating) {
        return res.status(400).json({
          success: false,
          message:
            "Missing required fields: course, teacher, and rating are required",
        });
      }

      // Trim and validate experience field
      experience = String(experience || "").trim();
      if (!experience || experience.length < 10) {
        return res.status(400).json({
          success: false,
          message:
            "Please write your experience description (minimum 10 characters)",
        });
      }

      // Validate rating
      const ratingNum = parseInt(String(rating));
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }

      // Check if student is enrolled in the course and paid
      const enrollment = await Enrollment.findOne({
        studentId,
        courseId,
        status: { $in: ["active", "completed"] },
      });

      if (!enrollment) {
        return res.status(403).json({
          success: false,
          message:
            "You can only review courses you have enrolled in and paid for.",
        });
      }

      // Check if the student has already reviewed this teacher for this course
      const existingReview = await Review.findOne({
        studentId,
        courseId,
      });

      if (existingReview) {
        return res.status(409).json({
          success: false,
          message: "You have already submitted a review for this course.",
        });
      }

      const review = new Review({
        studentId,
        teacherId,
        courseId,
        rating: ratingNum,
        experience,
      });

      await review.save();

      // Update Teacher's average rating using aggregation
      const stats = await Review.aggregate([
        { $match: { teacherId: new mongoose.Types.ObjectId(teacherId) } },
        {
          $group: {
            _id: "$teacherId",
            avgRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ]);

      if (stats.length > 0) {
        await User.findByIdAndUpdate(teacherId, {
          averageRating: Math.round(stats[0].avgRating * 10) / 10,
          totalReviews: stats[0].totalReviews,
        });
      }

      res.status(201).json({
        success: true,
        message: "Review submitted successfully",
        data: review,
      });
    } catch (error: any) {
      console.error("Error submitting review:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to submit review",
      });
    }
  }

  public static async getTeacherReviews(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const reviews = await Review.find({ teacherId: id })
        .populate("studentId", "name googleId authProvider") // Select name, and fields needed for avatar
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: reviews,
      });
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch reviews",
      });
    }
  }

  public static async getCourseReviews(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const reviews = await Review.find({ courseId: id })
        .populate("studentId", "name googleId authProvider")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: reviews,
      });
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch reviews",
      });
    }
  }
}
