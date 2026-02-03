export type Project = {
  id: string;
  name: string;
  thumbnailUrl?: string;
};

export type CreateProjectRequest = {
  name: string;
};

export type UpdateProjectRequest = Partial<CreateProjectRequest>;
