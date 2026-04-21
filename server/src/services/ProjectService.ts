import { ProjectRepository } from "../repositories/ProjectRepository";
import { ProjectApplicationRepository } from "../repositories/ProjectApplicationRepository";
import { ApiError } from "../utils/errors";

export class ProjectService {
  private projectRepository: ProjectRepository;
  private applicationRepository: ProjectApplicationRepository;

  constructor() {
    this.projectRepository = new ProjectRepository();
    this.applicationRepository = new ProjectApplicationRepository();
  }

  async createProject(clientId: string, data: any) {
    return this.projectRepository.create({ ...data, clientId });
  }

  async getClientProjects(clientId: string) {
    const projects = await this.projectRepository.findByClientId(clientId);
    return Promise.all(
      projects.map(async (p) => {
        const applicationCount =
          await this.applicationRepository.countByProjectId(p._id as string);
        return {
          _id: p._id,
          title: p.title,
          price: p.price,
          status: p.status,
          timePeriod: p.timePeriod,
          createdAt: p.createdAt,
          applicationCount,
        };
      }),
    );
  }

  async getProjectDetailsByClient(clientId: string, projectId: string) {
    const project = await this.projectRepository.findById(projectId);
    if (!project) throw new ApiError(404, "Project not found");
    if ((project.clientId as any)._id.toString() !== clientId) {
      throw new ApiError(403, "Not authorized to view this project");
    }
    return project;
  }

  async updateProjectStatus(
    clientId: string,
    projectId: string,
    status: string,
  ) {
    const project = await this.projectRepository.findById(projectId);
    if (!project) throw new ApiError(404, "Project not found");
    if ((project.clientId as any)._id.toString() !== clientId) {
      throw new ApiError(403, "Not authorized to update this project");
    }
    return this.projectRepository.updateStatus(projectId, status);
  }

  async getOpenProjectsForStudents() {
    const projects = await this.projectRepository.findOpenProjects();
    return projects.map((p) => ({
      _id: p._id,
      title: p.title,
      description: p.description,
      clientId: p.clientId,
      price: p.price,
      timePeriod: p.timePeriod,
      languagePreferences: p.languagePreferences,
    }));
  }

  async getProjectDetailsForStudent(projectId: string) {
    const project = await this.projectRepository.findById(projectId);
    if (
      !project ||
      project.status === "closed" ||
      project.status === "completed"
    ) {
      throw new ApiError(404, "Project not found or no longer available");
    }
    return {
      _id: project._id,
      title: project.title,
      description: project.description,
      price: project.price,
      languagePreferences: project.languagePreferences,
      timePeriod: project.timePeriod,
      createdAt: project.createdAt,
      clientId: project.clientId,
      clientName: (project.clientId as any)?.name || "Anonymous",
      company: (project.clientId as any)?.company || "Independent",
    };
  }

  async applyToProject(studentId: string, projectId: string) {
    const project = await this.projectRepository.findById(projectId);
    if (!project) throw new ApiError(404, "Project not found");
    if (project.status !== "open")
      throw new ApiError(400, "Project is no longer open for applications");

    const existingApp =
      await this.applicationRepository.findByProjectAndStudent(
        projectId,
        studentId,
      );
    if (existingApp)
      throw new ApiError(400, "You have already applied to this project");

    return this.applicationRepository.create({
      projectId: projectId as any,
      studentId: studentId as any,
      status: "pending",
    });
  }

  async getStudentApplications(studentId: string) {
    const apps = await this.applicationRepository.findByStudentId(studentId);
    return apps.map((app: any) => {
      const isApproved = app.status === "approved";
      return {
        _id: app._id,
        status: app.status,
        createdAt: app.createdAt,
        project: {
          _id: app.projectId._id,
          title: app.projectId.title,
          price: app.projectId.price,
          status: app.projectId.status,
          timePeriod: app.projectId.timePeriod,
        },
        client: isApproved
          ? {
              name: app.projectId.clientId?.name,
              email: app.projectId.clientId?.email,
              mobileNumber: app.projectId.clientId?.mobileNumber,
            }
          : null,
      };
    });
  }

  async getProjectApplications(clientId: string, projectId: string) {
    const project = await this.projectRepository.findById(projectId);
    if (!project) throw new ApiError(404, "Project not found");
    if ((project.clientId as any)._id.toString() !== clientId) {
      throw new ApiError(403, "Not authorized");
    }
    return this.applicationRepository.findByProjectId(projectId);
  }

  async updateApplicationStatus(
    clientId: string,
    appId: string,
    status: string,
  ) {
    const app: any = await this.applicationRepository.findById(appId);
    if (!app) throw new ApiError(404, "Application not found");

    const project = await this.projectRepository.findById(
      app.projectId._id.toString(),
    );
    if (!project) throw new ApiError(404, "Associated project not found");
    if ((project.clientId as any)._id.toString() !== clientId) {
      throw new ApiError(
        403,
        "Not authorized to modify applications for this project",
      );
    }

    return this.applicationRepository.updateStatus(appId, status);
  }
}
