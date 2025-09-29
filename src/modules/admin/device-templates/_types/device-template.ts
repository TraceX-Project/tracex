export enum Vendor {
  CISCO = 'cisco',
  DELL = 'dell',
  MIKROTIK = 'mikrotik',
}

export enum DeviceType {
  ROUTER = 'router',
  SWITCH = 'switch',
}

export type Port = {
  name: string;
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  deviceTemplateId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type DeviceTemplate = {
  id: string;
  modelName: string;
  vendor: Vendor;
  deviceType: DeviceType;
  unitSize: number;
  rows: number;
  columns: number;
  alignment: Alignment;
  frontPanelUrl: string;
  ports: Port[];
};

export enum Alignment {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

export type OutputImage = {
  url: string;
};

export type PortInput = {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type CreateDeviceTemplateRequest = {
  modelName: string;
  vendor: Vendor;
  deviceType: DeviceType;
  frontPanelUrl: string;
  unitSize: number;
  rows: number;
  columns: number;
  alignment: Alignment;
  ports: PortInput[];
};



export type UpdateDeviceTemplateRequest = Partial<CreateDeviceTemplateRequest>;
