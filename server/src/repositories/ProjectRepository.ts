import Project, { IProject } from "../models/Project";

export class ProjectRepository {
  async create(projectData: Partial<IProject>): Promise<IProject> {
    const project = new Project(projectData);
    return project.save();
  }

  async findById(id: string): Promise<IProject | null> {
    return Project.findById(id).populate(
      "clientId",
      "name email mobileNumber company profession linkedinUrl",
    );
  }

  async findByClientId(clientId: string): Promise<IProject[]> {
    return Project.find({ clientId }).sort({ createdAt: -1 });
  }

  async findOpenProjects(): Promise<IProject[]> {
    return Project.find({ status: "open" })
      .populate("clientId", "name")
      .sort({ createdAt: -1 });
  }

  async updateStatus(id: string, status: string): Promise<IProject | null> {
    return Project.findByIdAndUpdate(id, { status }, { new: true });
  }
}
