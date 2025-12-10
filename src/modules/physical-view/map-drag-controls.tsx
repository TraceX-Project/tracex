import React, { useCallback } from 'react';
import { Save, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { Button } from '@/shared/components/ui/button';
import { useBuildingDragStore } from './_store/building-drag.store';
import { useUpdateBuilding } from '../buildings/_hooks/use-update-building';
import { useBoolean } from '@/shared/hooks/use-boolean';

export const MapDragControls = () => {
  const { mutateAsync: updateBuilding } = useUpdateBuilding();
  const { value: isSaving, setValue: setIsSaving } = useBoolean(false);

  const tempLocation = useBuildingDragStore((state) => state.tempLocation);
  const editBuilding = useBuildingDragStore((state) => state.editBuilding);
  const { cancelDragMode } = useBuildingDragStore((state) => state.actions);

  const handleSave = useCallback(async () => {
    if (!tempLocation || !editBuilding) return;

    try {
      setIsSaving(true);
      await updateBuilding({
        id: editBuilding.id,
        payload: { location: tempLocation },
        projectId: editBuilding.projectId!,
      });

      cancelDragMode();
    } catch (error) {
      console.error('Failed to update building location:', error);
    } finally {
      setIsSaving(false);
    }
  }, [tempLocation, editBuilding, updateBuilding, cancelDragMode]);

  return (
    <TooltipProvider>
      <div className="bg-background/95 absolute top-4 right-4 z-50 flex items-center gap-2 rounded-lg border p-2 shadow-lg backdrop-blur-sm">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handleSave} size="icon" disabled={isSaving} className="h-9 w-9">
              <Save className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save location</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={cancelDragMode}
              size="icon"
              disabled={isSaving}
              variant="outline"
              className="h-9 w-9"
            >
              <X className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Cancel</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
