import { create } from 'zustand';

type ProjectModalState = {
  isOpen: boolean;
  actions: {
    setIsOpen: (isOpen: boolean) => void;
  };
};

export const useProjectModalStore = create<ProjectModalState>((set) => ({
  isOpen: false,
  actions: {
    setIsOpen: (isOpen: boolean) => set({ isOpen }),
  },
}));
