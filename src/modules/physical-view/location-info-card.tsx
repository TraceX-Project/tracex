'use client';

import { MapPinPlus, X } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import { Button } from '@/shared/components/ui/button';
import { usePhysicalMapStore } from './_store/physical-map.store';

const LocationInfoCard = () => {
  const selectedLocation = usePhysicalMapStore((state) => state.selectedLocation);
  const address = usePhysicalMapStore((state) => state.address);
  const { reset } = usePhysicalMapStore((state) => state.actions);

  if (!address) {
    return null;
  }

  const handleClearSelection = () => {
    reset();
  };

  return (
    <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 transform">
      <Card className="relative mx-auto w-full max-w-md shadow-lg backdrop-blur-sm">
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 h-6 w-6 rounded-full"
          onClick={handleClearSelection}
          title="Clear selection"
        >
          <X className="h-3 w-3" />
        </Button>
        <CardContent className="flex items-center gap-4">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold">{address.name}</h2>
            <p className="text-muted-foreground line-clamp-2 text-sm">{address.address}</p>
            <Separator className="w-full max-w-[200px]" />
            <p className="text-muted-foreground text-xs">
              {selectedLocation?.lat}, {selectedLocation?.lng}
            </p>
          </div>

          <Button size="icon" className="h-10 w-10 rounded-full">
            <MapPinPlus className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationInfoCard;
