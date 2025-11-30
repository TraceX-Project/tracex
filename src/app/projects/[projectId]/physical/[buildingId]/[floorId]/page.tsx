import { getBuildingById } from '@/modules/buildings/_services/buildings.service';
import EmptyBuilding from '@/modules/buildings/empty-building';
import { getFloor } from '@/modules/floors/_services/floors.service';
import FloorSelector from '@/modules/floors/floor-selector';
import FloorPlanDisplay from '@/modules/floors/floorplan-display';

type Props = {
  params: Promise<{ projectId: string; buildingId: string; floorId: string }>;
};

export default async function FloorPage({ params }: Props) {
  const { buildingId, floorId } = await params;
  const building = await getBuildingById(buildingId);
  const floor = await getFloor(floorId);

  if (!building?.floors?.length) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <EmptyBuilding buildingId={buildingId} />
      </div>
    );
  }

  return (
    <div className="relative h-full max-h-screen w-full max-w-screen">
      {floor && <FloorPlanDisplay planUrl={floor.planUrl} />}

      <div className="absolute right-4 bottom-4 sm:right-8">
        <FloorSelector building={building} currentFloorId={floorId} />
      </div>
    </div>
  );
}
