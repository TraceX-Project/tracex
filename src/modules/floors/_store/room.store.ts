import { type Position } from '@/modules/logical-view/_types/logical-view';
import { create } from 'zustand';

type RoomState = {
  isCreateRoomModalOpen: boolean;
  clickedPosition: Position | null;
  movingRoomId: string | null;
  cursorPosition: { x: number; y: number } | null;
  actions: {
    setIsCreateRoomModalOpen: (isOpen: boolean) => void;
    setClickedPosition: (position: Position | null) => void;
    setMovingRoomId: (roomId: string | null) => void;
    setCursorPosition: (cursorPosition: { x: number; y: number } | null) => void;
  };
};

export const useRoomStore = create<RoomState>((set) => ({
  isCreateRoomModalOpen: false,
  clickedPosition: null,
  movingRoomId: null,
  cursorPosition: null,
  actions: {
    setIsCreateRoomModalOpen: (isOpen) => set({ isCreateRoomModalOpen: isOpen }),
    setClickedPosition: (position) => set({ clickedPosition: position }),
    setMovingRoomId: (roomId) => set({ movingRoomId: roomId }),
    setCursorPosition: (cursorPosition) => set({ cursorPosition }),
  },
}));
