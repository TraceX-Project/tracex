import axios from '@/shared/lib/axios';
import { CreateProjectRequest, Project } from '../_types/projects';
import { ENDPOINTS } from '@/shared/config/endpoints';
import { SuccessResponse } from '@/shared/types/response';

export const createProject = async (payload: CreateProjectRequest) => {
  console.log("creaeteProject payload: ", payload);
  const { data } = await axios.post<SuccessResponse<Project>>(ENDPOINTS.projects.create, payload);

  return data.data;
};

export const getProjects = async () => {
  const { data } = await axios.get<SuccessResponse<Project[]>>(ENDPOINTS.projects.getAll);

  return data.data;
};
