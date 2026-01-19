'use client';

import * as React from 'react';
import { DEFAULT_MAP_CENTER, DEFAULT_ZOOM_LEVEL } from './_constants/constants';
import { useGetBuildings } from '../buildings/_hooks/use-get-buildings';
import { Map, MapLocateControl, MapMarker, MapMarkerClusterGroup, MapSearchControl, MapTileLayer } from "@/shared/components/ui/map"
import "leaflet/dist/leaflet.css";
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { IconMapPinFilled } from '@tabler/icons-react';
import LocationInfoCard from './location-info-card';
import { type PlaceFeature } from '@/shared/components/ui/place-autocomplete';
import { formatAddress } from './utils/leaflet';
import { usePhysicalMapStore } from './_store/physical-map.store';
import { useCallback, useEffect } from 'react';
import CreateBuildingDialog from './create-building-modal';
import BuildingMarker from './building-marker';
import MapClickHandler from './map-click-handler';

type Props = {
  projectId: string;
};

const PhysicalMap = ({ projectId }: Props) => {
  const { data: buildings } = useGetBuildings(projectId)
  const { setSelectedLocation, reset } = usePhysicalMapStore(state => state.actions)
  const selectedLocation = usePhysicalMapStore(state => state.selectedLocation)

  useEffect(() => {
    reset();
  }, [reset]);


  const handlePlaceSelect = useCallback((feature: PlaceFeature) => {
    const position = feature.geometry.coordinates.toReversed()
    console.log(position)

    setSelectedLocation({
      name: feature.properties.name ?? feature.properties.street ?? 'Unknown Location',
      address: formatAddress(feature.properties),
      location: {
        lat: position[0],
        lng: position[1]
      }
    })
  }, [setSelectedLocation])

  return (
    <div className="relative h-full w-full">
      <Map center={DEFAULT_MAP_CENTER} zoom={DEFAULT_ZOOM_LEVEL} attributionControl={true}>
        <MapTileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapLocateControl />

        <MapMarkerClusterGroup>
          {buildings?.map((building, i) => (
            <BuildingMarker
              key={i}
              building={building}
            />
          ))}
        </MapMarkerClusterGroup>

        <MapSearchControl
          lang='en'
          onPlaceSelect={handlePlaceSelect}
        />


        {selectedLocation && (
          <MapMarker position={selectedLocation.location} icon={<IconMapPinFilled className='text-red-600 w-8 h-8 hover:scale-105 hover:text-red-700' />} />
        )}

        <MapClickHandler />
      </Map>

      <LocationInfoCard />
      <LocationInfoCard />
      <CreateBuildingDialog projectId={projectId} />
    </div>
  );
};

export default PhysicalMap;

