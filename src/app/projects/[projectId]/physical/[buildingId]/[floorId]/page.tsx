import BuildingView from '@/modules/floors/floor-view';
import { use } from 'react';

type Props = {
  params: Promise<{ id: string; buildingId: string; floorId: string }>;
};

export default function FloorPage({ params }: Props) {
  const { buildingId, floorId } = use(params);

  return <BuildingView buildingId={buildingId} floorId={floorId} />;
}
