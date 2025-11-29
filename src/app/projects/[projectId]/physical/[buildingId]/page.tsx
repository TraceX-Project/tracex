'use client';

import { useGetBuilding } from '@/modules/buildings/_hooks/use-get-building';
import EmptyBuilding from '@/modules/buildings/empty-building';
import { PATHS } from '@/shared/config/paths';
import { useRouter } from 'next/navigation';
import { use, useEffect } from 'react';

type Props = {
  params: Promise<{ projectId: string; buildingId: string }>;
};

export default function BuildingPage({ params }: Props) {
  const { buildingId, projectId } = use(params);
  const { data: building, isLoading } = useGetBuilding(buildingId);
  const router = useRouter();

  useEffect(() => {
    if (building?.floors?.length) {
      const sortedFloors = [...building.floors].sort((a, b) => a.sortOrder - b.sortOrder);
      const defaultFloor = sortedFloors[sortedFloors.length - 1];

      router.replace(PATHS.projects.floorView(projectId, building.id, defaultFloor.id));
    }
  }, [building, router, projectId]);

  if (isLoading || !building) {
    return <div className="h-full w-full animate-pulse bg-gray-200" />;
  }

  if (!building.floors?.length) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <EmptyBuilding buildingId={buildingId} />
      </div>
    );
  }

  return <div className="h-full w-full animate-pulse bg-gray-200" />;
}
