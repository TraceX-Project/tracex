'use client';

import React, { useCallback, useMemo } from 'react';
import { Button } from '@/shared/components/ui/button';
import { PATHS } from '@/shared/config/paths';
import { useParams, useRouter } from 'next/navigation';
import { type Building } from '../buildings/_types/buildings';
import { Floor } from './_types/floor';

type Props = {
  floors: Floor[];
  currentFloorId: string;
};

const FloorSelector = ({ floors, currentFloorId }: Props) => {
  const { projectId, buildingId } = useParams<{
    projectId: string;
    buildingId: string;
    floorId: string;
  }>();
  const router = useRouter();
  const sortedFloors = useMemo(
    () => [...floors].sort((a, b) => a.sortOrder - b.sortOrder),
    [floors]
  );

  const handleSelectFloor = useCallback(
    (floorId: string) => {
      router.replace(PATHS.projects.floorView(projectId, buildingId, floorId));
    },
    [projectId, buildingId, router]
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
