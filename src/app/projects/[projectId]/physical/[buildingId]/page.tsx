import { PATHS } from '@/shared/config/paths';
import { redirect, notFound } from 'next/navigation';
import EmptyBuilding from '@/modules/buildings/empty-building';
import { getBuildingById } from '@/modules/buildings/_services/buildings.service';
import { ApiError } from '@/shared/lib/api-error';

type Props = {
  params: Promise<{ projectId: string; buildingId: string }>;
};

export default async function BuildingPage({ params }: Props) {
  const { buildingId, projectId } = await params;
  try {
    const response = await getBuildingById(buildingId);
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
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404 || error.status === 400) {
        notFound();
      }
    }
    throw error;
  }
}
