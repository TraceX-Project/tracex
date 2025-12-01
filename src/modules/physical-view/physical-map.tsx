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
import CreateBuildingModal from './create-building-modal';
import BuildingMarker from './building-marker';
import { useGetBuildings } from '../buildings/_hooks/use-get-buildings';

type Props = {
  projectId: string;
};

const PhysicalMap = ({ projectId }: Props) => {
  const selectedLocation = usePhysicalMapStore((state) => state.selectedLocation);
  const { reset, setSelectedLocation } = usePhysicalMapStore((state) => state.actions);

  const mapRef = useRef<MapRef | null>(null);
  const [viewState, setViewState] = React.useState(INITIAL_VIEW_STATE);
  const { data: buildings } = useGetBuildings(projectId);

  const geoCodingCore = useGeocodingCore({
    accessToken: ENV.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
    language: 'en',
  });

  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      const { lat, lng } = selectedLocation.location;
      const currentZoom = mapRef.current.getZoom();

      mapRef.current.easeTo({
        center: [lng, lat],
        essential: true,
        zoom: currentZoom,
        duration: 2000,
      });
    }
  }, [selectedLocation]);

  useEffect(() => {
    reset();
  }, [reset]);

  const handleMapClick = useCallback(
    async (event: MapMouseEvent) => {
      const { lngLat } = event;

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
        address: feature?.properties?.full_address,
        name: feature?.properties?.name,
        location: {
          lat: lngLat.lat,
          lng: lngLat.lng,
        },
      });
    },
    [setSelectedLocation, geoCodingCore]
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
        {buildings?.map((building) => (
          <BuildingMarker key={building.id} building={building} />
        ))}
      </MapContainer>

      <LocationInfoCard />

      <CreateBuildingModal projectId={projectId} />
    </div>
  );
};

export default PhysicalMap;
