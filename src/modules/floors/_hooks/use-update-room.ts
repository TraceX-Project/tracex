import { getQueryClient } from "@/shared/tanstack-query/get-query-client"
import { useMutation } from "@tanstack/react-query"
import { updateRoom } from "../_services/rooms.service"
import { QUERY_KEYS } from "@/shared/constants/query-key"
import { type UpdateRoomInput } from "@/modules/rooms/_schema/schema"

export const useUpdateRoom = () => {
  const queryClient = getQueryClient()

  return useMutation({
    mutationFn: ({ roomId, payload }: { roomId: string, payload: UpdateRoomInput }) => updateRoom(roomId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.rooms, data.floorId],
      })
    }
  })
}