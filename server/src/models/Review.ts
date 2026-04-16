import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IReview extends Document {
  studentId: ObjectId;
  teacherId: ObjectId;
  courseId: ObjectId;
  rating: number;
  experience: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    experience: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Performance Indexes for faster queries
ReviewSchema.index({ teacherId: 1 }); // For finding teacher reviews
ReviewSchema.index({ courseId: 1 }); // For finding course reviews
ReviewSchema.index({ studentId: 1 }); // For finding student reviews
ReviewSchema.index({ teacherId: 1, createdAt: -1 }); // For teacher reviews sorted by date
ReviewSchema.index({ courseId: 1, createdAt: -1 }); // For course reviews sorted by date
ReviewSchema.index({ studentId: 1, courseId: 1 }); // For finding existing review from student

export default mongoose.model<IReview>("Review", ReviewSchema);
