import type { RackDevice } from "../_types/room";

export const isSlotOccupied = (uPosition: number, devices: RackDevice[]) => {
  return devices.some(d => {
    const start = d.uPosition;
    const end = d.uPosition + (d.deviceTemplate?.unitSize || 1) - 1;
    return uPosition >= start && uPosition <= end;
  });
};