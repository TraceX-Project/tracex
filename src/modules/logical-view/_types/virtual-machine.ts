export type VirtualMachine = {
  id: string;
  name: string;
  serverId: string;
  externalId: string;
  vmType: 'qemu' | 'lxc';
  x: number | null;
  y: number | null;
  cpuCores: number;
  disk: number;
  ram: number;
};
