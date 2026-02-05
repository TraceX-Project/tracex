import { getQueryClient } from "@/shared/tanstack-query/get-query-client"
import { useMutation } from "@tanstack/react-query"
import { updateDevicePosition, } from "../_services/devices.service"
import { QUERY_KEYS } from "@/shared/constants/query-key"
import { Position } from "../_types/logical-view"

export const useUpdateDevicePosition = () => {
  const queryClient = getQueryClient()

  return useMutation({
    mutationFn: ({ id, position }: { id: string, position: Position }) => updateDevicePosition(id, position),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.topology] })
    }
  })
}
