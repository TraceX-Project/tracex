import { create } from 'zustand';

export type Location = { lng: number; lat: number };

type MapLocation = {
  name: string;
  address: string;
  location: Location;
};

type PhysicalMapStoreState = {
  selectedLocation: MapLocation | null;
  movingBuildingId: string | null;
  isCreateBuildingModalOpen: boolean;
  actions: {
    setSelectedLocation: (location: MapLocation | null) => void;
    setMovingBuildingId: (id: string | null) => void;
    reset: () => void;
    setIsCreateBuildingModalOpen: (isOpen: boolean) => void;
  };
};

export const usePhysicalMapStore = create<PhysicalMapStoreState>((set, get) => ({
  selectedLocation: null,
  movingBuildingId: null,
  isCreateBuildingModalOpen: false,
  actions: {
    setSelectedLocation: (location) => set({ selectedLocation: location }),
    setMovingBuildingId: (id) => set({ movingBuildingId: id }),
    reset: () => set({ selectedLocation: null, movingBuildingId: null }),
    setIsCreateBuildingModalOpen: (isOpen) => set({ isCreateBuildingModalOpen: isOpen }),
  },
}));
