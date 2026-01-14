import { request } from "@/shared/lib/api";
import { type LogicalDevice } from "../_types/logical-view";
import { ENDPOINTS } from "@/shared/config/endpoints";

export const getLogicalDevices = async (projectId: string) => {
  const response = await request<LogicalDevice[]>({
    method: 'GET',
    path: ENDPOINTS.projects.logicalDevices(projectId),
  });

  return response;
};