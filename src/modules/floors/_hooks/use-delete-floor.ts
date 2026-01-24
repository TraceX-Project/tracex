import { useMutation } from "@tanstack/react-query"
import { deleteFloor } from "../_services/floors.service"
import { getQueryClient } from "@/shared/tanstack-query/get-query-client"
import { QUERY_KEYS } from "@/shared/constants/query-key"

export const useDeleteFloor = () => {
  const queryClient = getQueryClient()

  return useMutation({
    mutationFn: (floorId: string) => deleteFloor(floorId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.floors, data.buildingId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.buildings, data.buildingId] })
    }
  })
}