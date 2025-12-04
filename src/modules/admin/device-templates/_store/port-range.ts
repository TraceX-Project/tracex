import { create } from 'zustand';
import { type PortRange, PortType } from '../_types/device-template';
import { v4 as uuidv4 } from 'uuid';

type PortRangeState = {
  portRanges: PortRange[];
  actions: {
    addPortRange: () => void;
    removePortRange: (id: string) => void;
  };
};

export const usePortRangeStore = create<PortRangeState>((set, get) => ({
  portRanges: [],
  actions: {
    addPortRange: () => {
      const newPortRange: PortRange = {
        id: uuidv4(),
        start: 1,
        end: 1,
        runningNumber: 1,
        prefix: '',
        portType: PortType.FAST_ETHERNET,
      };

      set({
        portRanges: [...get().portRanges, newPortRange],
      });
    },

    removePortRange: (id: string) => {
      set({
        portRanges: get().portRanges.filter((range) => range.id !== id),
      });
    },
  },
}));
