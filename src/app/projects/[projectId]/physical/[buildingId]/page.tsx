import { PATHS } from '@/shared/config/paths';
import { redirect } from 'next/navigation';
import EmptyBuilding from '@/modules/buildings/empty-building';
import { getBuildingById } from '@/modules/buildings/_services/buildings.service';

type Props = {
  params: Promise<{ projectId: string; buildingId: string }>;
};

export default async function BuildingPage({ params }: Props) {
  const { buildingId, projectId } = await params;
  const building = await getBuildingById(buildingId);

  if (!building) {
    return <div>Building not found</div>;
  }

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
