export type Device = {
  id: string;
  modelName: string;
  brand: 'cisco' | 'dell' | 'mikrotik';
  type: 'router' | 'switch';
  frontPanel: string;
  backPanel: string;
};
