import { Router } from "express";
import {
  startLiveClass,
  createAutoRecordingMeet,
} from "../controllers/classController";

const router = Router();

// POST /create-meet - Creates an auto-recording Google Meet link
router.post("/create-meet", createAutoRecordingMeet);

// POST /start - Creates an instant Google Meet link
router.post("/start", startLiveClass);

export default router;
