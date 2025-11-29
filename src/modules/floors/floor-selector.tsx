import React, { useCallback, useMemo } from 'react';
import { Button } from '@/shared/components/ui/button';
import { PATHS } from '@/shared/config/paths';
import { useRouter } from 'next/navigation';
import { type Building } from '../buildings/_types/buildings';

type Props = {
  building: Building;
  currentFloorId: string;
};

const FloorSelector = ({ building, currentFloorId }: Props) => {
  const router = useRouter();
  const sortedFloors = useMemo(
    () => [...building?.floors].sort((a, b) => a.sortOrder - b.sortOrder),
    [building?.floors]
  );

  const handleSelectFloor = useCallback(
    (floorId: string) => {
      router.replace(PATHS.projects.floorView(building.projectId!, building.id, floorId));
    },
    [building.projectId, building.id, router]
  );

  return (
    <div className="flex flex-col space-y-2 rounded-lg bg-white p-2 shadow-lg">
      {sortedFloors.map((floor) => (
        <Button
          key={floor.id}
          variant={currentFloorId === floor.id ? 'default' : 'outline'}
          size="sm"
          aria-selected={currentFloorId === floor.id}
          onClick={() => handleSelectFloor(floor.id)}
        >
          {floor.name}
        </Button>
      ))}
    </div>
  );
};

export default FloorSelector;
