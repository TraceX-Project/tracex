import { getQueryClient } from "@/shared/tanstack-query/get-query-client";
import { useMutation } from "@tanstack/react-query";
import { deleteRack } from "../_services/room.service";
import { QUERY_KEYS } from "@/shared/constants/query-key";

export const useDeleteRack = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: (rackId: string) => deleteRack(rackId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.racks] });
    },
  });
}