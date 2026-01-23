export type VirtualMachine = {
  id: string;
  name: string;
  serverId: string;
  externalId: string;
  vmType: 'qemu' | 'lxc';
  x: number | null;
  y: number | null;
  details: VirtualMachineDetails | null;
};

export type VirtualMachineDetails = {
  id: string;
  cpu: number;
  mem: number;
  disk: number;
  name: string;
  node: string;
  type: 'qemu' | 'lxc';
  vmid: number;
  netin: number;
  maxcpu: number;
  maxmem: number;
  netout: number;
  status: string;
  uptime: number;
  maxdisk: number;
  memhost: number;
  diskread: number;
  template: number;
  diskwrite: number;
};
