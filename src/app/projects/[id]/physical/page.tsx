'use client';

import dynamic from 'next/dynamic';
import { use } from 'react';
import { useQueryStates } from 'nuqs';
import { parseAsUUID } from '@/shared/utils/parsers';

type Props = {
  params: Promise<{ id: string }>;
};

const PhysicalMap = dynamic(() => import('@/modules/physical-view/physical-map'), { ssr: false });
const BuildingView = dynamic(() => import('@/modules/buildings/building-view'), { ssr: false });
const FloorView = dynamic(() => import('@/modules/floors/floor-view'), { ssr: false });
const RoomView = dynamic(() => import('@/modules/rooms/room-view'), { ssr: false });

export default function PhysicalPage({ params }: Props) {
  const [query, _] = useQueryStates({
    buildingId: parseAsUUID,
    floorId: parseAsUUID,
    roomId: parseAsUUID,
  });

  const { id: projectId } = use(params);

  if (query.buildingId && query.floorId && query.roomId) {
    return <RoomView />;
  }

  if (query.buildingId && query.floorId) {
    return <FloorView />;
  }

  if (query.buildingId) {
    return <BuildingView buildingId={query.buildingId} />;
  }

  return <PhysicalMap projectId={projectId} />;
}
