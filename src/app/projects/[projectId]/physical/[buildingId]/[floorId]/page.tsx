import { getBuildingById } from '@/modules/buildings/_services/buildings.service';
import { getFloor } from '@/modules/floors/_services/floors.service';
import FloorView from '@/modules/floors/floor-view';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

type Props = {
  params: Promise<{ projectId: string; buildingId: string; floorId: string }>;
};

export default async function FloorPage({ params }: Props) {
  const { buildingId, floorId, projectId } = await params;
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.buildings, buildingId],
      queryFn: () => getBuildingById(buildingId),
    }),
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.floors, floorId],
      queryFn: () => getFloor(floorId),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FloorView projectId={projectId} buildingId={buildingId} floorId={floorId} />
    </HydrationBoundary>
  );
}
