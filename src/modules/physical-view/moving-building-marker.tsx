
import { useEffect, useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import { usePhysicalMapStore } from './_store/physical-map.store';
import { MapCustomMarker } from '@/shared/components/ui/map-custom-marker';
import { IconMapPinFilled } from '@tabler/icons-react';
import { useUpdateBuilding } from '../buildings/_hooks/use-update-building';
import { type Location } from './_store/physical-map.store';
import { MapTooltip } from '@/shared/components/ui/map';

type Props = {
  projectId: string;
};

const MovingBuildingMarker = ({ projectId }: Props) => {
  const movingBuildingId = usePhysicalMapStore((state) => state.movingBuildingId);
  const { setMovingBuildingId } = usePhysicalMapStore((state) => state.actions);
  const [position, setPosition] = useState<Location | null>(null);

  const { mutateAsync: updateBuilding } = useUpdateBuilding();

  const map = useMapEvents({
    mousemove: (e) => {
      if (movingBuildingId) {
        setPosition(e.latlng);
      }
    },
    click: (e) => {
      if (movingBuildingId) {
        const updateBuildingFn = async () => {
          await updateBuilding({
            id: movingBuildingId,
            projectId,
            payload: {
              location: {
                lat: e.latlng.lat,
                lng: e.latlng.lng,
              }
            }
          });

          setMovingBuildingId(null);
          setPosition(null);

          map.dragging.enable();
        }

        updateBuildingFn()
      }
    },
  });

  useEffect(() => {
    if (movingBuildingId) {
      map.dragging.disable();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setMovingBuildingId(null);
          setPosition(null);
          map.dragging.enable();
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        map.dragging.enable();
      };
    } else {
      map.dragging.enable();
    }
  }, [movingBuildingId, map.dragging, setMovingBuildingId]);


  if (!movingBuildingId || !position) return null;

  return (
    <MapCustomMarker
      position={position}
      icon={<IconMapPinFilled className="text-orange-600 w-8 h-8 opacity-70" />}
      zIndexOffset={1000}
      interactive={false}
    >
      <MapTooltip side="right" permanent>
        Click to update location
      </MapTooltip>
    </MapCustomMarker>
  );
};

export default MovingBuildingMarker;
