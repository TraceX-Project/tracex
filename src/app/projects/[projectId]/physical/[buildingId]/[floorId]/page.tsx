import { getFloor, getFloors, getRooms } from '@/modules/floors/_services/floors.service';
import FloorView from '@/modules/floors/floor-view';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

type Props = {
  params: Promise<{ projectId: string; buildingId: string; floorId: string }>;
};

export default async function FloorPage({ params }: Props) {
  const { buildingId, floorId } = await params;
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
      <FloorView buildingId={buildingId} floorId={floorId} />
    </HydrationBoundary>
  );
}
