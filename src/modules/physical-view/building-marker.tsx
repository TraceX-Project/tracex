import { Marker } from 'react-map-gl/mapbox';
import { Building } from './_types/buildings';
import { IconMapPinFilled } from '@tabler/icons-react';

type Props = {
  building: Building;
};

const BuildingMarker = ({ building }: Props) => {
  return (
    <Marker longitude={building.location.lng} latitude={building.location.lat} anchor="bottom">
      <IconMapPinFilled className="h-7 w-7 text-blue-500" />
    </Marker>
  );
};

export default BuildingMarker;
