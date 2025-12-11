import * as React from 'react';
import Map, { type ViewStateChangeEvent, type MapRef, type ViewState } from 'react-map-gl/mapbox';
import { ENV } from '@/shared/config/env';
import { useCallback } from 'react';
import { type MapMouseEvent } from 'mapbox-gl';
import { useBuildingDragStore } from './_store/building-drag.store';
import { MapDragControls } from './map-drag-controls';

type Props = {
  onMapRef: (ref: MapRef | null) => void;
  viewState: Pick<ViewState, 'longitude' | 'latitude' | 'zoom'>;
  onViewStateChange: (viewState: ViewState) => void;
  children?: React.ReactNode;
  onMapClick: (evt: MapMouseEvent) => void;
};

const MapContainer = ({ onMapRef, viewState, onViewStateChange, children, onMapClick }: Props) => {
  const editBuilding = useBuildingDragStore((state) => state.editBuilding);
  const { setTempLocation } = useBuildingDragStore((state) => state.actions);

  const onMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      onViewStateChange(evt.viewState);
    },
    [onViewStateChange]
  );

  const handleMapClick = useCallback(
    (evt: MapMouseEvent) => {
      if (editBuilding) {
        const { lng, lat } = evt.lngLat;
        setTempLocation({ lng, lat });

        return;
      }

      onMapClick(evt);
    },
    [onMapClick, editBuilding, setTempLocation]
  );

  return (
    <>
      <div className="mapbox-container" style={{ width: '100%', height: '100%' }}>
        <Map
          ref={onMapRef}
          mapboxAccessToken={ENV.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          {...viewState}
          onMove={onMove}
          onClick={handleMapClick}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          style={{ width: '100%', height: '100%' }}
          minZoom={6}
          maxZoom={18}
          dragRotate={false}
          touchZoomRotate={false}
          keyboard={false}
          touchPitch={false}
        >
          {children}
        </Map>
      </div>

      {editBuilding && <MapDragControls />}
    </>
  );
};

export default MapContainer;
