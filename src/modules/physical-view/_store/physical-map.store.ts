import { create } from 'zustand';

export type Location = { lng: number; lat: number };

type Address = {
  name: string;
  address: string;
};

type PhysicalMapStoreState = {
  selectedLocation: Location | null;
  address: Address | null;
  clearTrigger: number;
  actions: {
    setSelectedLocation: (location: Location | null) => void;
    setAddress: (address: Address) => void;
    reset: () => void;
  };
};

export const usePhysicalMapStore = create<PhysicalMapStoreState>((set, get) => ({
  selectedLocation: null,
  address: null,
  clearTrigger: 0,
  actions: {
    setSelectedLocation: (location) => set({ selectedLocation: location }),
    setAddress: (address) => set({ address }),
    reset: () =>
      set({ selectedLocation: null, address: null, clearTrigger: get().clearTrigger + 1 }),
  },
}));
