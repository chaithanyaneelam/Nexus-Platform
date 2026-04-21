import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  clientId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  languagePreferences: string;
  timePeriod: string;
  status: "open" | "in-progress" | "completed" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    languagePreferences: {
      type: String,
      default: "Any language",
      trim: true,
    },
    timePeriod: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "completed", "closed"],
      default: "open",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IProject>("Project", ProjectSchema);
