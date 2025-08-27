export enum DeviceBrand {
  CISCO = 'cisco',
  DELL = 'dell',
  MIKROTIK = 'mikrotik',
}

export enum DeviceType {
  ROUTER = 'router',
  SWITCH = 'switch',
}

export type DeviceTemplate = {
  id: string;
  modelName: string;
  brand: DeviceBrand;
  type: DeviceType;
  FrontPanelURL: string;
  BackPanelURL: string;
  size: number;
};

export type OutputImage = {
  url: string;
};

export type CreateDeviceTemplateRequest = {
  modelName: string;
  brand: DeviceBrand;
  type: DeviceType;
  frontPanelId: string;
  backPanelId: string;
  unitSize: number;
};

export type UpdateDeviceTemplateRequest = Partial<CreateDeviceTemplateRequest>;
