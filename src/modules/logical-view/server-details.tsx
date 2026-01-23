import { type Server } from './_types/server';
import Image from 'next/image';
import { Badge } from '@/shared/components/ui/badge';
import { Box, Globe, Server as ServerIcon, ShieldCheck } from 'lucide-react';
import { Separator } from '@/shared/components/ui/separator';
import { detailColumns, DetailRow } from './details-table-config';
import { useMemo } from 'react';
import { useDataTable } from '@/shared/hooks/use-data-table';
import DataTable from '@/shared/components/table/data-table';

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
        value: <span className="font-mono text-sm">{device.apiUrl}</span>,
      },
    ];
  }, [device]);

  const { table } = useDataTable({
    data,
    columns: detailColumns,
    pageCount: 1,
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Details
        </div>
        <Separator />
      </div>
      <DataTable table={table} withPagination={false} fullHeight={false} />
      <div className="group relative aspect-video w-full overflow-hidden rounded-xl border bg-gradient-to-b from-background to-muted/50 shadow-sm transition-all hover:shadow-md">
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <Image
            src={device.deviceTemplate.frontPanelUrl}
            alt={device.name}
            fill
            className="object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
};

