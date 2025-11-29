import React, { useMemo } from 'react';
import { Floor } from '../floors/_types/floor';
import { Button } from '@/shared/components/ui/button';

type Props = {
  floors: Floor[];
  selectedFloor: Floor | null;
  onSelect: (floor: Floor) => void;
};

const FloorSelector = ({ floors, selectedFloor, onSelect }: Props) => {
  const sortedFloors = useMemo(
    () => [...floors].sort((a, b) => a.sortOrder - b.sortOrder),
    [floors]
  );

  return (
    <div className="flex flex-col space-y-2 rounded-lg bg-white p-2 shadow-lg">
      {sortedFloors.map((floor) => (
        <Button
          key={floor.id}
          variant={selectedFloor?.id === floor.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(floor)}
          aria-selected={selectedFloor?.id === floor.id}
        >
          {floor.name}
        </Button>
      ))}
    </div>
  );
};

export default FloorSelector;
