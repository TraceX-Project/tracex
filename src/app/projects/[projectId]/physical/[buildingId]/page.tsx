import { PATHS } from '@/shared/config/paths';
import { redirect, notFound } from 'next/navigation';
import EmptyBuilding from '@/modules/buildings/empty-building';
import { getBuildingById } from '@/modules/buildings/_services/buildings.service';
import { Building } from '@/modules/buildings/_types/buildings';
import { ApiError } from '@/shared/lib/api-error';

type Props = {
  params: Promise<{ projectId: string; buildingId: string }>;
};

export default async function BuildingPage({ params }: Props) {
  const { buildingId, projectId } = await params;
  const response = await getBuildingById(buildingId);

  if (response instanceof ApiError) {
    if (response.status === 404) {
      notFound();
    }
    if (response.status === 400) {
      return <p>400 Bad Request page placeholder</p>;
    }
    return <p>Error loading building page placeholder</p>;
  }

  const building = response;
  if (!building.floors?.length) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <EmptyBuilding buildingId={buildingId} />
      </div>
    );
  }

  const sortedFloors = [...building.floors].sort((a, b) => a.sortOrder - b.sortOrder);
  const defaultFloor = sortedFloors[sortedFloors.length - 1];

  redirect(PATHS.projects.floorView(projectId, building.id, defaultFloor.id));
}
