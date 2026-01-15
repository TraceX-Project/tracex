'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import EmptyBuilding from '../buildings/empty-building';
import FloorSelector from './floor-selector';
import FloorPlanDisplay from './floorplan-display';
import { useGetFloorById, useGetFloors } from './_hooks/use-floor';

type Props = {
  buildingId: string;
  floorId: string;
};

const FloorView = ({ floorId, buildingId }: Props) => {
  const { data: floors, isError: floorsError } = useGetFloors(buildingId);
  const { data: floor, isError } = useGetFloorById(floorId);

  if (floorsError) {
    return notFound();
  }

  if (!floors?.length) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <EmptyBuilding buildingId={buildingId} />
      </div>
    );
  }

  if (!floor || isError) {
    return notFound();
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
