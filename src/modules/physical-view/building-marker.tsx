import { MapTooltip } from '@/shared/components/ui/map';
import { MapCustomMarker } from '@/shared/components/ui/map-custom-marker';
import { type Building } from '../buildings/_types/buildings';
import { BuildingMarkerContextMenu } from './building-marker-context-menu';

import { useRouter } from 'next/navigation';
import { PATHS } from '@/shared/config/paths';

type Props = {
  building: Building;
  projectId: string;
};

const BuildingMarker = ({ building, projectId }: Props) => {
  const router = useRouter();

  const eventHandlers = {
    click: () => {
      router.push(PATHS.projects.buildingView(projectId, building.id));
    },
  };

  return (
    <MapCustomMarker
      position={building.location}
      eventHandlers={eventHandlers}
      icon={<BuildingMarkerContextMenu building={building} />}
    >
      <MapTooltip side="bottom">{building.name}</MapTooltip>
    </MapCustomMarker>
  );
};

export default BuildingMarker;
