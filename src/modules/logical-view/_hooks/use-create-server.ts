import { useMutation } from "@tanstack/react-query";
import { CreateServerRequest } from "../_types/logical-view";
import { createServer } from "../_services/devices.service";

export const useCreateServer = () => {
  return useMutation({
    mutationFn: async ({
      projectId,
      data,
    }: {
      projectId: string;
      data: CreateServerRequest;
    }) => createServer(projectId, data),
  });
};
