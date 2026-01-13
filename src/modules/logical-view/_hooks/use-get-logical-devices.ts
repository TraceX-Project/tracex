import { useQuery } from "@tanstack/react-query";
import { getLogicalDevices } from "../_services/devices.service";
import { QUERY_KEYS } from "@/shared/constants/query-key";

export const useGetLogicalDevices = (projectId: string) => {
  return useQuery({
    queryFn: () => getLogicalDevices(projectId),
    queryKey: [QUERY_KEYS.logicalDevices, projectId],
    enabled: !!projectId,
  });
} 