'use client';

import * as React from 'react';
import Map from 'react-map-gl/mapbox';
import { ENV } from '@/shared/config/env';

// Configure Mapbox GL CSS
import 'mapbox-gl/dist/mapbox-gl.css';

const INITIAL_VIEW_STATE = {
  longitude: 100.7758382356726,
  latitude: 13.729223964884206,
  zoom: 15,
};

export function PhysicalMap() {
  return (
    <div className="h-full w-full">
      <Map
        mapboxAccessToken={ENV.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
