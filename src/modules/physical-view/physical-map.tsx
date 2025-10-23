'use client';

import * as React from 'react';
import { useRef, useEffect, useCallback } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxSearchBox from './search-box';
import { usePhysicalMapStore } from './_store/physical-map.store';
import type { MapMouseEvent, MapRef } from 'react-map-gl/mapbox';
import { INITIAL_VIEW_STATE } from './_constants/constants';
import MapContainer from './map-container';
import LocationMarker from './location-marker';
import LocationInfoCard from './location-info-card';
import { useGeocodingCore } from '@mapbox/search-js-react';
import { ENV } from '@/shared/config/env';

export function PhysicalMap() {
  const selectedLocation = usePhysicalMapStore((state) => state.selectedLocation);
  const { reset, setSelectedLocation } = usePhysicalMapStore((state) => state.actions);
  const mapRef = useRef<MapRef | null>(null);
  const [viewState, setViewState] = React.useState(INITIAL_VIEW_STATE);
  const geoCodingCore = useGeocodingCore({
    accessToken: ENV.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
    language: 'en',
  });

  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      const { lat, lng } = selectedLocation.location;

      mapRef.current.flyTo({
        center: [lng, lat],
        essential: true,
        zoom: 15,
        duration: 2000,
      });
    }
  }, [selectedLocation]);

  useEffect(() => {
    reset();
  }, []);

  const handleMapClick = useCallback(
    async (evt: MapMouseEvent) => {
      const { lngLat } = evt;

      const result = await geoCodingCore.reverse(
        {
          lat: lngLat.lat,
          lng: lngLat.lng,
        },
        {
          language: 'th',
          country: 'th',
          limit: 1,
        }
      );

      const feature = result.features[0];

      setSelectedLocation({
        address: feature.properties.full_address,
        name: feature.properties.name,
        location: {
          lat: lngLat.lat,
          lng: lngLat.lng,
        },
      });
    },
    [setSelectedLocation]
  );

  return (
    <div className="relative h-full w-full">
      <MapboxSearchBox />

      <MapContainer
        onMapRef={(ref) => (mapRef.current = ref)}
        viewState={viewState}
        onViewStateChange={setViewState}
        onMapClick={handleMapClick}
      >
        <LocationMarker />
      </MapContainer>

      <LocationInfoCard />
    </div>
  );
}
