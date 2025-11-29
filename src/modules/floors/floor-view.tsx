'use client';

import React, { useEffect, useState } from 'react';
import EmptyBuilding from '../buildings/empty-building';
import { useGetBuilding } from '../buildings/_hooks/use-get-building';
import { type Floor } from './_types/floor';
import FloorPlanDisplay from './floorplan-display';
import FloorSelector from './floor-selector';
import { useGetFloor } from './_hooks/use-get-floor';

type Props = {
  buildingId: string;
  floorId: string;
};

const FloorView = ({ buildingId, floorId }: Props) => {
  const { data: building, isLoading } = useGetBuilding(buildingId);
  const { data: floor } = useGetFloor(floorId);

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
      {floor && <FloorPlanDisplay planUrl={floor.planUrl} />}

      <div className="absolute right-4 bottom-4 sm:right-8">
        <FloorSelector building={building} currentFloorId={floorId} />
      </div>
    </div>
  );
};

export default FloorView;
