import { getBuildings } from '@/modules/buildings/_services/buildings.service';
import PhysicalMapClient from '@/modules/physical-view/physical-map-client';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

type Props = {
  params: Promise<{ projectId: string }>;
};

export default async function PhysicalPage({ params }: Props) {
  const { projectId } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.projects, projectId, QUERY_KEYS.buildings],
    queryFn: () => getBuildings(projectId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PhysicalMapClient projectId={projectId} />
    </HydrationBoundary>
  );
}
