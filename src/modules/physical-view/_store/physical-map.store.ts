import { create } from 'zustand';

export type Location = { lng: number; lat: number };

type MapLocation = {
  name: string;
  address: string;
  location: Location;
};

type PhysicalMapStoreState = {
  selectedLocation: MapLocation | null;
  isCreateBuildingModalOpen: boolean;
  actions: {
    setSelectedLocation: (location: MapLocation | null) => void;
    reset: () => void;
    setIsCreateBuildingModalOpen: (isOpen: boolean) => void;
  };
};

export const usePhysicalMapStore = create<PhysicalMapStoreState>((set, get) => ({
  selectedLocation: null,
  isCreateBuildingModalOpen: false,
  actions: {
    setSelectedLocation: (location) => set({ selectedLocation: location }),
    reset: () => set({ selectedLocation: null }),
    setIsCreateBuildingModalOpen: (isOpen) => set({ isCreateBuildingModalOpen: isOpen }),
  },
}));
