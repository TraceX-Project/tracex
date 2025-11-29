import { Marker } from 'react-map-gl/mapbox';
import Link from 'next/link';
import { type Building } from '../buildings/_types/buildings';
import { IconMapPinFilled } from '@tabler/icons-react';

type Props = {
  building: Building;
};

const BuildingMarker = ({ building }: Props) => {
  return (
    <Marker longitude={building.location.lng} latitude={building.location.lat} anchor="bottom">
      <Link
        href={`/projects/${building.projectId}/physical/?buildingId=${building.id}`}
        prefetch={false}
      >
        <IconMapPinFilled className="h-7 w-7 cursor-pointer text-blue-500 transition-colors hover:text-blue-600" />
      </Link>
    </Marker>
  );
};

export default BuildingMarker;
