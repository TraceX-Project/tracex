import * as React from 'react';
import Map, { ViewStateChangeEvent, MapRef, ViewState } from 'react-map-gl/mapbox';
import { ENV } from '@/shared/config/env';
import { useCallback } from 'react';
import { MapMouseEvent } from 'mapbox-gl';

type Props = {
  onMapRef: (ref: MapRef | null) => void;
  viewState: Pick<ViewState, 'longitude' | 'latitude' | 'zoom'>;
  onViewStateChange: (viewState: ViewState) => void;
  children?: React.ReactNode;
  onMapClick: (evt: MapMouseEvent) => void;
};

const MapContainer = ({ onMapRef, viewState, onViewStateChange, children, onMapClick }: Props) => {
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
      onClick={onMapClick}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </Map>
  );
};

export default MapContainer;
