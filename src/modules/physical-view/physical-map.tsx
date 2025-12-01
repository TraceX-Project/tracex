'use client';

import * as React from 'react';
import Map, { type ViewStateChangeEvent, Marker } from 'react-map-gl/mapbox';
import { ENV } from '@/shared/config/env';
import { useRef, useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxSearchBox from './search-box';
import { useCallback } from 'react';
import { usePhysicalMapStore } from './_store/physical-map.store';
import type { MapRef } from 'react-map-gl/mapbox';

const INITIAL_VIEW_STATE = {
  longitude: 100.7758382356726,
  latitude: 13.729223964884206,
  zoom: 15,
};

export function PhysicalMap() {
  const selectedLocation = usePhysicalMapStore((state) => state.selectedLocation);
  const mapRef = useRef<MapRef | null>(null);

  const [viewState, setViewState] = React.useState(INITIAL_VIEW_STATE);

  const onMove = useCallback((evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  }, []);

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
    <div className="h-full w-full">
      <MapboxSearchBox />
      <Map
        ref={mapRef}
        mapboxAccessToken={ENV.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        {...viewState}
        onMove={onMove}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: '100%', height: '100%' }}
      >
        {selectedLocation && (
          <Marker
            longitude={selectedLocation.lng}
            latitude={selectedLocation.lat}
            anchor="bottom"
            color="red"
          />
        )}
      </Map>
    </div>
  );
}
