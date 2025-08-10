export type Project = {
  id: string;
  name: string;
};

export type CreateProjectRequest = {
  name: string;
};

export type UpdateProjectRequest = Partial<CreateProjectRequest>;
