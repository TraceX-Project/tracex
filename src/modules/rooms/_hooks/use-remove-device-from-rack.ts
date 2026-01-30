import { useMutation } from "@tanstack/react-query"
import { removeDeviceFromRack } from "../_services/room.service";
import { QUERY_KEYS } from "@/shared/constants/query-key";
import { getQueryClient } from "@/shared/tanstack-query/get-query-client";

export const useRemoveDeviceFromRack = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: async ({ rackId, deviceId, roomId }: { rackId: string; deviceId: string; roomId: string }) => removeDeviceFromRack(rackId, deviceId),
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.racks, roomId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.physicalDevices] })
    },
  })
}