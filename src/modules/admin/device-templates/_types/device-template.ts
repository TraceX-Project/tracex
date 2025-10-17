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
  x: number;
  y: number;
  w: number;
  h: number;
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

export type DevicePorts = {
  taskId: string;
  status: string;
  ports: Port[];
}
export type PortInput = {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type CreateDeviceTemplateRequest = {
  modelName: string;
  vendor: Vendor;
  deviceType: DeviceType;
  frontPanel: File;
  unitSize: number;
  rows: number;
  columns: number;
  alignment: Alignment;
  ports: PortInput[];
};



export type UpdateDeviceTemplateRequest = Partial<CreateDeviceTemplateRequest>;
