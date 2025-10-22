'use client';

import * as React from 'react';
import { useRef, useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxSearchBox from './search-box';
import { usePhysicalMapStore } from './_store/physical-map.store';
import type { MapRef } from 'react-map-gl/mapbox';
import { INITIAL_VIEW_STATE } from './_constants/constants';
import MapContainer from './map-container';
import LocationMarker from './location-marker';
import LocationInfoCard from './location-info-card';

export function PhysicalMap() {
  const selectedLocation = usePhysicalMapStore((state) => state.selectedLocation);
  const mapRef = useRef<MapRef | null>(null);
  const [viewState, setViewState] = React.useState(INITIAL_VIEW_STATE);

  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      mapRef.current.flyTo({
        center: [selectedLocation.lng, selectedLocation.lat],
        essential: true,
        zoom: 15,
        duration: 2000,
      });
    }
  }, [selectedLocation]);

  return (
    <div className="relative h-full w-full">
      <MapboxSearchBox />
      <MapContainer
        onMapRef={(ref) => (mapRef.current = ref)}
        viewState={viewState}
        onViewStateChange={setViewState}
      >
        <LocationMarker />
      </MapContainer>

      <LocationInfoCard />
    </div>
  );
}
