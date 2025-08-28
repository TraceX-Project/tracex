export type Device = {
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

export const FrontPanelURLMock =
  'https://media.router-switch.com/media/mf_webp/jpg/media/catalog/product/cache/b90fceee6a5fa7acd36a04c7b968181c/c/i/cisco_isr4451-x-k9.webp';
export const BackPanelURLMock =
  'https://media.router-switch.com/media/mf_webp/jpg/media/catalog/product/cache/b90fceee6a5fa7acd36a04c7b968181c/c/i/cisco_isr4451-x-k9-back.webp';
export type UpdateDeviceTemplateRequest = Partial<CreateDeviceTemplateRequest>;
