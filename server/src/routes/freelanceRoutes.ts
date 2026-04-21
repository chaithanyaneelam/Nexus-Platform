import express from "express";
import { ProjectController } from "../controllers/ProjectController";
import { authenticate, authorize } from "../middleware/auth";
import { ROLES } from "../config/constants";

const router = express.Router();

/**
 * CLIENT ROUTES
 */
router.post(
  "/client/projects",
  authenticate,
  authorize(ROLES.CLIENT),
  ProjectController.createProject,
);

router.get(
  "/client/projects",
  authenticate,
  authorize(ROLES.CLIENT),
  ProjectController.getClientProjects,
);

router.get(
  "/client/projects/:id",
  authenticate,
  authorize(ROLES.CLIENT),
  ProjectController.getProjectDetailsByClient,
);

router.patch(
  "/client/projects/:id/status",
  authenticate,
  authorize(ROLES.CLIENT),
  ProjectController.updateProjectStatus,
);

router.get(
  "/client/projects/:projectId/applications",
  authenticate,
  authorize(ROLES.CLIENT),
  ProjectController.getProjectApplications,
);

router.patch(
  "/client/applications/:appId",
  authenticate,
  authorize(ROLES.CLIENT),
  ProjectController.updateApplicationStatus,
);

/**
 * STUDENT ROUTES
 */
router.get(
  "/student/projects",
  authenticate,
  authorize(ROLES.STUDENT),
  ProjectController.getOpenProjectsForStudents,
);

router.get(
  "/student/projects/:id",
  authenticate,
  authorize(ROLES.STUDENT),
  ProjectController.getProjectDetailsForStudent,
);

router.post(
  "/student/applications",
  authenticate,
  authorize(ROLES.STUDENT),
  ProjectController.applyToProject,
);

router.get(
  "/student/applications",
  authenticate,
  authorize(ROLES.STUDENT),
  ProjectController.getStudentApplications,
);

export default router;
