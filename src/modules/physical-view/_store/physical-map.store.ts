import { create } from 'zustand';

export type Location = { lng: number; lat: number };

type PhysicalMapStoreState = {
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
};

export const usePhysicalMapStore = create<PhysicalMapStoreState>((set) => ({
  selectedLocation: null,
  setSelectedLocation: (location) => set({ selectedLocation: location }),
}));
