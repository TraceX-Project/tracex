import { type Server } from './_types/server';
import Image from 'next/image';
import { Badge } from '@/shared/components/ui/badge';
import { Globe, Server as ServerIcon, ShieldCheck } from 'lucide-react';

type Props = {
  device: Server;
};

export const ServerDetails = ({ device }: Props) => {
  return (
    <div className="space-y-6">
      {/* Front Panel Image Hero */}
      {device.deviceTemplate?.frontPanelUrl ? (
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
      ) : (
        <div className="flex aspect-video w-full items-center justify-center rounded-xl border bg-muted/20">
          <ServerIcon className="h-12 w-12 text-muted-foreground/20" />
        </div>
      )}


      <div className="space-y-4">
        {/* Chips Row */}
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" className="text-xs font-normal">
            {device.deviceTemplate?.modelName || 'Unknown Model'}
          </Badge>
          <Badge variant="secondary" className="text-xs font-normal capitalize">
            {device.vendor}
          </Badge>
        </div>

        <div className="grid gap-3">
          <div className="flex items-center gap-3 rounded-md border p-2.5 shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              <Globe className="h-4 w-4" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs text-muted-foreground font-medium uppercase">API Connection</p>
              <p className="truncate text-sm font-semibold" title={device.apiUrl}>{device.apiUrl}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-md border p-2.5 shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-medium uppercase">Vendor</p>
              <p className="text-sm font-semibold capitalize">{device.vendor}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

