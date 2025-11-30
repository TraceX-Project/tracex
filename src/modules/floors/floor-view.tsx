'use client';

import React from 'react';
import { useGetBuilding } from '../buildings/_hooks/use-get-building';
import { useGetFloor } from './_hooks/use-get-floor';
import EmptyBuilding from '../buildings/empty-building';
import FloorSelector from './floor-selector';
import FloorPlanDisplay from './floorplan-display';
import { notFound } from 'next/navigation';

type Props = {
  buildingId: string;
  floorId: string;
  projectId: string;
};

const FloorView = ({ floorId, buildingId, projectId }: Props) => {
  const { data: building } = useGetBuilding(buildingId);
  const { data: floor, isError } = useGetFloor(floorId);
  console.log('Rendering FloorView with buildingId:', buildingId, 'and floorId:', floorId);

  if (!building) {
    return <div>Building Not Found</div>;
  }

  if (!building?.floors?.length) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <EmptyBuilding buildingId={buildingId} />
      </div>
    );
  }

  if (!floor || isError) {
    console.log('Floor not found for floorId:', floorId);
    notFound();
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
