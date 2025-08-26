export type DeviceTemplate = {
  id: string;
  modelName: string;
  brand: 'cisco' | 'dell' | 'mikrotik';
  type: 'router' | 'switch';
  FrontPanelURL: string;
  BackPanelURL: string;
  size: number;
};

export type OutputImage = {
  url: string;
};

export type CreateDeviceTemplateRequest = {
  modelName: string;
  brand: 'cisco' | 'dell' | 'mikrotik';
  type: 'router' | 'switch';
  FrontPanelURL: string;
  BackPanelURL: string;
  size: number;
};

export type UpdateDeviceTemplateRequest = Partial<CreateDeviceTemplateRequest>;
