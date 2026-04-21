import ProjectApplication, {
  IProjectApplication,
} from "../models/ProjectApplication";

export class ProjectApplicationRepository {
  async create(
    applicationData: Partial<IProjectApplication>,
  ): Promise<IProjectApplication> {
    const app = new ProjectApplication(applicationData);
    return app.save();
  }

  async findById(id: string): Promise<IProjectApplication | null> {
    return ProjectApplication.findById(id).populate("projectId");
  }

  async findByProjectAndStudent(
    projectId: string,
    studentId: string,
  ): Promise<IProjectApplication | null> {
    return ProjectApplication.findOne({ projectId, studentId });
  }

  async findByProjectId(projectId: string): Promise<IProjectApplication[]> {
    return ProjectApplication.find({ projectId }).populate(
      "studentId",
      "name email mobileNumber linkedinUrl githubUrl",
    );
  }

  async findByStudentId(studentId: string): Promise<IProjectApplication[]> {
    return ProjectApplication.find({ studentId }).populate({
      path: "projectId",
      populate: {
        path: "clientId",
        select: "name email mobileNumber company",
      },
    });
  }

  async updateStatus(
    id: string,
    status: string,
  ): Promise<IProjectApplication | null> {
    return ProjectApplication.findByIdAndUpdate(id, { status }, { new: true });
  }

  async countByProjectId(projectId: string): Promise<number> {
    return ProjectApplication.countDocuments({ projectId });
  }
}
