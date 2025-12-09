import { create } from 'zustand';
import { Alignment, type BoundingBox } from '../_types/device-template';

type PortBoundingBoxState = {
  boxes: BoundingBox[];
  selectedBoxId: number | null;
  alignment: Alignment;

  actions: {
    setBoxes: (boxes: BoundingBox[]) => void;
    selectBox: (id: number | null) => void;
    deleteSelectedBox: () => void;
    addNewBox: (box: BoundingBox) => void;
    setAlignment: (align: Alignment) => void;
    updateBox: (id: number, box: Partial<BoundingBox>) => void;
  };
};

export const usePortBoundingBoxStore = create<PortBoundingBoxState>((set, get) => ({
  boxes: [],
  selectedBoxId: null,
  alignment: Alignment.HORIZONTAL,

  actions: {
    setBoxes: (boxes) => set({ boxes }),

    selectBox: (id) => set({ selectedBoxId: id }),

    deleteSelectedBox: () => {
      const { boxes, selectedBoxId } = get();

      if (selectedBoxId === null) return;

      const filtered = boxes.filter((_, i) => i !== selectedBoxId);
      set({
        boxes: filtered,
        selectedBoxId: null,
      });
    },

    addNewBox: (box: BoundingBox) => {
      const { boxes } = get();
      set({ boxes: [...boxes, box] });
    },

    setAlignment: (alignment) => set({ alignment }),

    updateBox: (id, boxUpdate) => {
      const { boxes } = get();
      const newBoxes = [...boxes];
      newBoxes[id] = { ...newBoxes[id], ...boxUpdate };
      set({ boxes: newBoxes });
    },
  },
}));
