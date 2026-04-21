import mongoose, { Schema, Document } from "mongoose";

export interface IProjectApplication extends Document {
  projectId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const ProjectApplicationSchema = new Schema<IProjectApplication>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IProjectApplication>(
  "ProjectApplication",
  ProjectApplicationSchema,
);
