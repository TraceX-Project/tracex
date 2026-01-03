export type Room = {
  id: string;
  x: number;
  y: number;
  name: string;
  floorId: string;
};

export type Rack = {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  roomId: string;
  unitSize: number;
}

export type CreateRackRequest = {
  name: string;
  unitSize: number;
  sortOrder: number;
  roomId: string;
}