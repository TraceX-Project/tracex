import { getFloors, getFloor, getRooms } from '@/modules/floors/_services/floors.service';
import RoomView from '@/modules/rooms/room-view';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

type Props = {
  params: Promise<{ projectId: string; buildingId: string; floorId: string, roomId: string }>;
};

export default async function RoomPage({ params }: Props) {
  const { buildingId, floorId, roomId } = await params;
  const queryClient = new QueryClient();

   await Promise.all([
      queryClient.prefetchQuery({
        queryKey: [QUERY_KEYS.floors, buildingId],
        queryFn: () => getFloors(buildingId),
      }),
      queryClient.prefetchQuery({
        queryKey: [QUERY_KEYS.floors, floorId],
        queryFn: () => getFloor(floorId),
      }),
      queryClient.prefetchQuery({
        queryKey: [QUERY_KEYS.rooms, floorId],
        queryFn: () => getRooms(floorId),
      }),
    ]);

  return (
      <HydrationBoundary state={dehydrate(queryClient)}>
          <RoomView roomId={roomId} />
      </HydrationBoundary>

  );
}
