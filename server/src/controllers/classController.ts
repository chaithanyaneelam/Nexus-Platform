import { Request, Response } from "express";
import { createInstantMeet } from "../services/meetService";
import {
  createClassSpace,
  moveRecordingToNexskill,
} from "../services/googleMeetService";

export const createAutoRecordingMeet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Validate environment variables
    if (
      !process.env.GOOGLE_CLIENT_ID ||
      !process.env.GOOGLE_CLIENT_SECRET ||
      !process.env.NEXSKILL_ADMIN_REFRESH_TOKEN
    ) {
      console.error("Missing Google API credentials in environment variables");
      res.status(500).json({
        success: false,
        message:
          "Server configuration error: Missing Google credentials. Please contact administrator.",
      });
      return;
    }

    console.log("📢 Creating Google Meet space...");
    const space = await createClassSpace();

    console.log("✅ Google Meet created successfully:", space.meetingUri);
    res.status(200).json({ success: true, meetingUri: space.meetingUri });
  } catch (error) {
    console.error("Failed to create auto-recording meet:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    // Provide helpful error messages
    let userFriendlyMessage =
      "Failed to auto-generate Google Meet link with recording.";

    if (errorMessage.includes("insufficient authentication scopes")) {
      userFriendlyMessage =
        "Authentication error: Refresh token missing required scopes. " +
        "Please regenerate the Google OAuth refresh token with these scopes: " +
        "Google Meet API (meetings.spaces.create) and Google Drive API";
    } else if (errorMessage.includes("invalid_grant")) {
      userFriendlyMessage =
        "Authentication error: Refresh token is invalid or expired. " +
        "Please regenerate the Google OAuth refresh token.";
    }

    res.status(500).json({
      success: false,
      message: userFriendlyMessage,
      error: errorMessage,
    });
  }
};

export const startLiveClass = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { courseName, teacherEmail } = req.body;

    if (!courseName || !teacherEmail) {
      res.status(400).json({
        success: false,
        message: "courseName and teacherEmail are required.",
      });
      return;
    }

    const meetUrl = await createInstantMeet(courseName, teacherEmail);

    res.status(200).json({ success: true, meetUrl });
  } catch (error) {
    console.error("Failed to start live class:", error);
    res.status(500).json({
      success: false,
      message: "Failed to auto-generate Google Meet link.",
    });
  }
};
