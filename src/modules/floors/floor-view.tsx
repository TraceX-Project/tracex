'use client';

import React, { useEffect, useState } from 'react';
import EmptyBuilding from '../buildings/empty-building';
import { useGetBuilding } from '../buildings/_hooks/use-get-building';
import { type Floor } from './_types/floor';
import FloorPlanDisplay from './floorplan-display';
import FloorSelector from './floor-selector';

type Props = {
  buildingId: string;
};

const FloorView = ({ buildingId }: Props) => {
  const { data: building, isLoading } = useGetBuilding(buildingId);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);

  useEffect(() => {
    if (!selectedFloor && building?.floors?.length) {
      const defaultFloor = building.floors[building.floors.length - 1];
      setSelectedFloor(defaultFloor);
    }
  }, [building, selectedFloor]);

  if (isLoading) {
    return <div className="h-full w-full animate-pulse bg-gray-200" />;
  }

  if (!building?.floors?.length) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <EmptyBuilding buildingId={buildingId} />
      </div>
    );
  }

  return (
    <div className="relative h-full max-h-screen w-full max-w-screen">
      {selectedFloor && <FloorPlanDisplay planUrl={selectedFloor.planUrl} />}

      <div className="absolute right-4 bottom-4 sm:right-8">
        <FloorSelector
          floors={building.floors}
          selectedFloor={selectedFloor}
          onSelect={setSelectedFloor}
        />
      </div>
    </div>
  );
};

export default FloorView;
