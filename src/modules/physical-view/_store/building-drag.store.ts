import { type Building } from '@/modules/buildings/_types/buildings';
import { create } from 'zustand';

type BuildingDragState = {
  tempLocation: { lat: number; lng: number } | null;
  editBuilding: Building | null;

  actions: {
    setTempLocation: (loc: { lat: number; lng: number } | null) => void;
    cancelDragMode: () => void;
    startEditMode: (building: Building) => void;
  };
};

export const useBuildingDragStore = create<BuildingDragState>((set) => ({
  tempLocation: null,
  editBuilding: null,

  actions: {
    setTempLocation: (tempLocation) => set({ tempLocation }),
    cancelDragMode: () =>
      set({
        tempLocation: null,
        editBuilding: null,
      }),
    startEditMode: (building) =>
      set({
        tempLocation: building.location,
        editBuilding: building,
      }),
  },
}));
