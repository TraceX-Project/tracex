import { Position } from '@/modules/logical-view/_types/logical-view';
import { create } from 'zustand';

type RoomState = {
  isCreateRoomModalOpen: boolean;
  clickedPosition: Position | null;
  seletedFloorId: string | null;
  actions: {
    setIsCreateRoomModalOpen: (isOpen: boolean) => void;
    setClickedPosition: (position: Position | null) => void;
    setSelectedFloorId: (floorId: string | null) => void;
  };
};

export const useRoomStore = create<RoomState>((set) => ({
  isCreateRoomModalOpen: false,
  clickedPosition: null,
  seletedFloorId: null,
  actions: {
    setIsCreateRoomModalOpen: (isOpen) => set({ isCreateRoomModalOpen: isOpen }),
    setClickedPosition: (position) => set({ clickedPosition: position }),
    setSelectedFloorId: (floorId) => set({ seletedFloorId: floorId }),
  },
}));
