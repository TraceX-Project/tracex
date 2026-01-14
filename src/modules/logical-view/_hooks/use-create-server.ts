import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/query-key";
import { CreateServerRequest } from "../_types/logical-view";
import { createServer } from "../_services/devices.service";

export const useCreateServer = () => {
  const queryClient = useQueryClient();

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
    },
  });
};
