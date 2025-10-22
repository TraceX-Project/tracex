import * as React from 'react';
import Map, { ViewStateChangeEvent, MapRef } from 'react-map-gl/mapbox';
import { ENV } from '@/shared/config/env';
import { useCallback } from 'react';

type Props = {
  onMapRef: (ref: MapRef | null) => void;
  viewState: any;
  onViewStateChange: (viewState: any) => void;
  children?: React.ReactNode;
};

const MapContainer = ({ onMapRef, viewState, onViewStateChange, children }: Props) => {
  const onMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      onViewStateChange(evt.viewState);
    },
    [onViewStateChange]
  );

  return (
    <Map
      ref={onMapRef}
      mapboxAccessToken={ENV.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      {...viewState}
      onMove={onMove}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </Map>
  );
};

export default MapContainer;
