import { getQueryClient } from "@/shared/tanstack-query/get-query-client"
import { useMutation } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/shared/constants/query-key"
import { UpdateDevicePositionsRequest } from "../_types/logical-view"
import { updateLogicalDevicePositions } from "../_services/logical-view.service"

export const useUpdateDevicePositions = () => {
  const queryClient = getQueryClient()

  return useMutation({
    mutationFn: ({ positions }: { positions: UpdateDevicePositionsRequest[] }) => updateLogicalDevicePositions(positions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.topology] })
    }
  })
}
