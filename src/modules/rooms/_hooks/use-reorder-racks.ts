import { reorderRacks } from "@/modules/floors/_services/rooms.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type Rack } from "../_types/room"
import { QUERY_KEYS } from "@/shared/constants/query-key"

const sortRacksByOrder = (
  racks: Rack[],
  orders: Pick<Rack, 'id' | 'sortOrder'>[]
) => {
  const orderMap = new Map(
    orders.map(o => [o.id, o.sortOrder])
  )

  return [...racks].sort((a, b) => {
    const orderA = orderMap.get(a.id) ?? Number.MAX_SAFE_INTEGER
    const orderB = orderMap.get(b.id) ?? Number.MAX_SAFE_INTEGER
    return orderA - orderB
  })
}

export const useReorderRacks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      roomId,
      racks
    }: {
      roomId: string,
      racks: Pick<Rack, 'id' | 'sortOrder'>[]
    }) => reorderRacks(roomId, racks),
    onMutate: (newReorder) => {
      queryClient.cancelQueries({ queryKey: [QUERY_KEYS.racks, newReorder.roomId] })

      const previousRacks = queryClient.getQueryData<Rack[]>([QUERY_KEYS.racks, newReorder.roomId])

      if (previousRacks) {
        queryClient.setQueryData([QUERY_KEYS.racks, newReorder.roomId], sortRacksByOrder(previousRacks, newReorder.racks))
      }

      return { previousRacks }
    },
    onError: (err, newReorder, context) => {
      if (context?.previousRacks) {
        queryClient.setQueryData([QUERY_KEYS.racks, newReorder.roomId], context.previousRacks)
      }
    },
  })
} 