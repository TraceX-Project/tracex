import { create } from 'zustand';

export type Location = { lng: number; lat: number };

type MapLocation = {
  name: string;
  address: string;
  location: Location;
};

type PhysicalMapStoreState = {
  selectedLocation: MapLocation | null;
  clearTrigger: number;
  actions: {
    setSelectedLocation: (location: MapLocation | null) => void;
    reset: () => void;
  };
};

export const usePhysicalMapStore = create<PhysicalMapStoreState>((set, get) => ({
  selectedLocation: null,
  address: null,
  clearTrigger: 0,
  actions: {
    setSelectedLocation: (location) => set({ selectedLocation: location }),
    reset: () => set({ selectedLocation: null, clearTrigger: get().clearTrigger + 1 }),
  },
}));
