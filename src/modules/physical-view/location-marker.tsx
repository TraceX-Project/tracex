import { Marker } from 'react-map-gl/mapbox';
import { usePhysicalMapStore } from './_store/physical-map.store';

const LocationMarker = () => {
  const selectedLocation = usePhysicalMapStore((state) => state.selectedLocation);

  if (!selectedLocation) {
    return null;
  }

  return (
    <Marker
      longitude={selectedLocation.lng}
      latitude={selectedLocation.lat}
      anchor="bottom"
      color="red"
    />
  );
};

export default LocationMarker;
