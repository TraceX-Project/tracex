import React, { useCallback, useMemo } from 'react';
import { type Floor } from './_types/floor';
import { Button } from '@/shared/components/ui/button';
import { useQueryState } from 'nuqs';
import { parseAsUUID } from '@/shared/utils/parsers';

type Props = {
  floors: Floor[];
  selectedFloor: Floor | null;
  onSelect: (floor: Floor) => void;
};

const FloorSelector = ({ floors, selectedFloor, onSelect }: Props) => {
  const [floorId, setFloorId] = useQueryState('floorId', parseAsUUID);

  const sortedFloors = useMemo(
    () => [...floors].sort((a, b) => a.sortOrder - b.sortOrder),
    [floors]
  );

  const handleFloorSelect = useCallback(
    (floor: Floor) => {
      setFloorId(floor.id);

      onSelect(floor);
    },
    [onSelect, setFloorId]
  );

  return (
    <div className="flex flex-col space-y-2 rounded-lg bg-white p-2 shadow-lg">
      {sortedFloors.map((floor) => (
        <Button
          key={floor.id}
          variant={selectedFloor?.id === floor.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFloorSelect(floor)}
          aria-selected={selectedFloor?.id === floor.id}
        >
          {floor.name}
        </Button>
      ))}
    </div>
  );
};

export default FloorSelector;
