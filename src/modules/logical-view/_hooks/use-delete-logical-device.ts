import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteLogicalDevices } from "../_services/devices.service"
import { QUERY_KEYS } from "@/shared/constants/query-key"

export const useDeleteLogicalDevice = (projectId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteLogicalDevices(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.topology, projectId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.logicalDevices, projectId] })
    },
  })
}
