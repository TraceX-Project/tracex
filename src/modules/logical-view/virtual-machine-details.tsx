import { type VirtualMachine } from './_types/virtual-machine';
import { formatBytes } from '@/shared/utils/file';
import { Activity, Cpu, MemoryStick, HardDrive, Server } from 'lucide-react';
import React, { useMemo } from 'react';
import { type DetailRow, DeviceDetailsTable } from './device-details-table';

type Props = {
  device: VirtualMachine;
};


export const VirtualMachineDetails = ({ device }: Props) => {
  const { details } = device;

  const data: DetailRow[] = useMemo(() => {
    if (!details) return [];
    return [
      {
        id: 'node',
        attribute: (
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span className="text-sm">Node</span>
          </div>
        ),
        value: <span className="font-mono text-sm">{details.node}</span>,
      },
      {
        id: 'vmid',
        attribute: (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] border rounded px-1 min-w-[20px] text-center h-4 flex items-center justify-center">ID</span>
            <span className="text-sm">VM ID</span>
          </div>
        ),
        value: <span className="font-mono text-sm">{details.vmid}</span>,
      },
      {
        id: 'cpu',
        attribute: (
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            <span className="text-sm">CPU Cores</span>
          </div>
        ),
        value: details.maxcpu,
      },
      {
        id: 'mem',
        attribute: (
          <div className="flex items-center gap-2">
            <MemoryStick className="h-4 w-4" />
            <span className="text-sm">Memory</span>
          </div>
        ),
        value: formatBytes(details.maxmem),
      },
      {
        id: 'disk',
        attribute: (
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            <span className="text-sm">Max Disk</span>
          </div>
        ),
        value: formatBytes(details.maxdisk),
      },
    ];
  }, [details]);

  if (!details) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <Activity className="mb-2 h-8 w-8 opacity-20" />
        <p>No details available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DeviceDetailsTable data={data} />
    </div>
  );
};



