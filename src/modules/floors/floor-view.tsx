'use client';

import React from 'react';
import { useGetFloor } from './_hooks/use-get-floor';
import EmptyBuilding from '../buildings/empty-building';
import FloorSelector from './floor-selector';
import FloorPlanDisplay from './floorplan-display';
import { useGetFloors } from './_hooks/use-get-floors';

type Props = {
  buildingId: string;
  floorId: string;
};

const FloorView = ({ floorId, buildingId }: Props) => {
  const { data: floors, isError: floorsError } = useGetFloors(buildingId);
  const { data: floor, isError } = useGetFloor(floorId);

  if (floorsError) {
    return <div>Building Not Found</div>;
  }

  if (!floors?.length) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <EmptyBuilding buildingId={buildingId} />
      </div>
    );
  }

  if (!floor || isError) {
    return <div>Floor Not Found</div>;
  }

  return (
    <div className="relative h-full max-h-screen w-full max-w-screen">
      <FloorPlanDisplay floor={floor} />

      <div className="absolute right-4 bottom-4 sm:right-8">
        <FloorSelector floors={floors} currentFloorId={floorId} />
      </div>
    </div>
  );
};

export default FloorView;
