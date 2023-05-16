interface IProjects {
  id: number;
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endDate: Date | null;
  developerId: number;
}

type TProjectRequest = Omit<IProjects, "id" | "developerId">;

interface ITechnologies {
  id: number;
  name: string;
}

type TTechnologiesRequest = Omit<ITechnologies, "id">;

interface IInsertTechology {
  id: number;
  addedIn: Date;
  technologyId: number;
  projectId: number;
}

type TInsertTechologyRequest = Omit<IInsertTechology, "id">;

interface IProjectsList {
  projectId: number;
  projectName: string;
  projectDescription: string;
  projectEstimatedTime: string;
  projectRepository: string;
  projectStartDate: Date;
  projectEndDate?: Date;
  projectDeveloperId: number;
  technologyId: number | null;
  technologyName: string | null;
}

type TProjectTechnology = Omit<IProjectsList, "projectDeveloperId">;

export {
  IProjects,
  TProjectRequest,
  ITechnologies,
  TTechnologiesRequest,
  IInsertTechology,
  TInsertTechologyRequest,
  IProjectsList,
  TProjectTechnology,
};
