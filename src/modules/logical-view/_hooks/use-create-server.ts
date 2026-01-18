import { useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/query-key";
import { type CreateServerRequest } from "../_types/logical-view";
import { createServer } from "../_services/devices.service";
import { getQueryClient } from "@/shared/tanstack-query/get-query-client";

export const useCreateServer = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      data,
    }: {
      projectId: string;
      data: CreateServerRequest;
    }) => createServer(projectId, data),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.topology, projectId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.logicalDevices, projectId] });
    },
  });
};
