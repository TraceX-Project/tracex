import { useRef } from 'react';
import { useMapEvents } from 'react-leaflet';
import { usePhysicalMapStore } from './_store/physical-map.store';
import { reverseGeocode } from './_services/map.service';
import { formatAddress } from './utils/leaflet';

const MapClickHandler = () => {
  const { setSelectedLocation } = usePhysicalMapStore((state) => state.actions);
  const movingBuildingId = usePhysicalMapStore((state) => state.movingBuildingId);

  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useMapEvents({
    click: (e) => {
      if (movingBuildingId) return;

      setSelectedLocation({
        name: 'Loading...',
        address: 'Fetching address...',
        location: e.latlng,
      });

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      debounceTimerRef.current = setTimeout(() => {
        const fetchLocationDetails = async () => {
          const controller = new AbortController();
          abortControllerRef.current = controller;

          try {
            const response = await reverseGeocode(e.latlng.lat, e.latlng.lng, controller.signal);

            const feature = response.features?.[0];
            setSelectedLocation({
              name: feature?.properties?.name ?? 'Unknown Location',
              address: formatAddress(feature?.properties),
              location: e.latlng,
            });
          } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
              return;
            }

            console.error('Reverse geocoding failed', error);
            setSelectedLocation({
              name: 'Unknown Location',
              address: 'Address not found',
              location: {
                lat: e.latlng.lat,
                lng: e.latlng.lng,
              },
            });
          }
        };

        fetchLocationDetails();
      }, 300);
    },
  });

  return null;
};

export default MapClickHandler;
