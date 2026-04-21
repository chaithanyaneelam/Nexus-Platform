import { Request, Response, NextFunction } from "express";
import { ProjectService } from "../services/ProjectService";
import {
  createProjectSchema,
  updateProjectStatusSchema,
  applyProjectSchema,
  updateApplicationStatusSchema,
} from "../validators/projectValidator";

const projectService = new ProjectService();

export class ProjectController {
  // CLIENT: Create Project
  static async createProject(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createProjectSchema.parse(req.body);
      const project = await projectService.createProject(
        req.user!.userId,
        validatedData,
      );
      res.status(201).json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  }

  // CLIENT: Get Summary view of my projects
  static async getClientProjects(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const projects = await projectService.getClientProjects(req.user!.userId);
      res.json({ success: true, data: projects });
    } catch (error) {
      next(error);
    }
  }

  // CLIENT: Get Detailed view of a project
  static async getProjectDetailsByClient(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const project = await projectService.getProjectDetailsByClient(
        req.user!.userId,
        req.params.id,
      );
      res.json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  }

  // CLIENT: Update Project Status (e.g. mark as closed or in-progress)
  static async updateProjectStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validatedData = updateProjectStatusSchema.parse(req.body);
      const project = await projectService.updateProjectStatus(
        req.user!.userId,
        req.params.id,
        validatedData.status,
      );
      res.json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  }

  // STUDENT: Get Summary view of Open projects
  static async getOpenProjectsForStudents(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const projects = await projectService.getOpenProjectsForStudents();
      res.json({ success: true, data: projects });
    } catch (error) {
      next(error);
    }
  }

  // STUDENT: Get Details for a specific open project
  static async getProjectDetailsForStudent(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const project = await projectService.getProjectDetailsForStudent(
        req.params.id,
      );
      res.json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  }

  // STUDENT: Apply to a project
  static async applyToProject(req: Request, res: Response, next: NextFunction) {
    try {
      // Body needs { projectId }
      const validatedData = applyProjectSchema.parse(req.body);
      const application = await projectService.applyToProject(
        req.user!.userId,
        validatedData.projectId,
      );
      res.status(201).json({ success: true, data: application });
    } catch (error) {
      next(error);
    }
  }

  // STUDENT: Get my submitted applications & their status
  static async getStudentApplications(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const applications = await projectService.getStudentApplications(
        req.user!.userId,
      );
      res.json({ success: true, data: applications });
    } catch (error) {
      next(error);
    }
  }

  // CLIENT: Get Applications submitted by students for a specific project
  static async getProjectApplications(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const applications = await projectService.getProjectApplications(
        req.user!.userId,
        req.params.projectId,
      );
      res.json({ success: true, data: applications });
    } catch (error) {
      next(error);
    }
  }

  // CLIENT: Approve or reject a specific application
  static async updateApplicationStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validatedData = updateApplicationStatusSchema.parse(req.body);
      const application = await projectService.updateApplicationStatus(
        req.user!.userId,
        req.params.appId,
        validatedData.status,
      );
      res.json({ success: true, data: application });
    } catch (error) {
      next(error);
    }
  }
}
