import { type Server } from './_types/server';
import { Box, Globe, Server as ServerIcon, ShieldCheck } from 'lucide-react';
import { type DetailRow } from './device-details-table';
import { useMemo } from 'react';
import { DeviceDetailsTable } from './device-details-table';
import { DeviceFrontPanel } from './device-front-panel';

type Props = {
  device: Server;
};

export const ServerDetails = ({ device }: Props) => {
  const data: DetailRow[] = useMemo(() => {
    return [
      {
        id: 'name',
        attribute: (
          <div className="flex items-center gap-2">
            <ServerIcon className="h-4 w-4" />
            <span className="text-sm">Name</span>
          </div>
        ),
        value: <span className="font-mono text-sm">{device.name}</span>,
      },
      {
        id: 'brand',
        attribute: (
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-sm">Brand</span>
          </div>
        ),
        value: <span className="font-mono text-sm">{device.vendor}</span>,
      },
      {
        id: 'model',
        attribute: (
          <div className="flex items-center gap-2">
            <Box className="h-4 w-4" />
            <span className="text-sm">Model</span>
          </div>
        ),
        value: <span className="font-mono text-sm">{device.deviceTemplate.modelName}</span>,
      },
      {
        id: 'api-url',
        attribute: (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="text-sm">API URL</span>
          </div>
        ),
        value: (
          <span className="font-mono text-sm block truncate max-w-[200px]" title={device.apiUrl}>
            {device.apiUrl}
          </span>
        ),
      },
    ];
  }, [device]);

  return (
    <div className="space-y-4">
      <DeviceDetailsTable data={data} />

      <DeviceFrontPanel src={device.deviceTemplate.frontPanelUrl} alt={device.name} />
    </div>
  );
};
