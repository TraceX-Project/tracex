import { create } from 'zustand';

export type Location = { lng: number; lat: number };

type Address = {
  name: string;
  address: string;
};

type PhysicalMapStoreState = {
  selectedLocation: Location | null;
  address: Address | null;
  actions: {
    setSelectedLocation: (location: Location | null) => void;
    setAddress: (address: Address) => void;
    reset: () => void;
  };
};

export const usePhysicalMapStore = create<PhysicalMapStoreState>((set) => ({
  selectedLocation: null,
  address: null,
  actions: {
    setSelectedLocation: (location) => set({ selectedLocation: location }),
    setAddress: (address) => set({ address }),
    reset: () => set({ selectedLocation: null, address: null }),
  },
}));
