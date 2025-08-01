import { ColumnDef } from '@tanstack/react-table';
import { Device } from './_types/device';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Button } from '@/shared/components/ui/button';
import { EllipsisVertical } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';

export const deviceColumns: ColumnDef<Device>[] = [
  {
    accessorKey: 'frontPanel',
    header: 'Front Panel',
    cell: ({ row }) => {
      return (
        <div className="relative aspect-square size-20">
          <Image
            src={row.getValue('frontPanel')}
            alt={`${row.getValue('modelName')} Front Panel`}
            className="rounded-md"
            fill
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'backPanel',
    header: 'Back Panel',
    cell: ({ row }) => {
      return (
        <div className="relative aspect-square size-20">
          <Image
            src={row.getValue('backPanel')}
            alt={`${row.getValue('modelName')} Back Panel`}
            className="rounded-md"
            fill
          />
        </div>
      );
    },
  },
  {
    header: () => <div className="w-full text-left">Model Name</div>,
    accessorKey: 'modelName',
  },
  {
    header: 'Brand',
    accessorKey: 'brand',
    cell: ({ row }) => {
      return (
        <Badge variant="default" className="capitalize">
          {row.getValue('brand')}
        </Badge>
      );
    },
  },
  {
    header: 'Type',
    accessorKey: 'type',
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="capitalize">
          {row.getValue('type')}
        </Badge>
      );
    },
  },
  {
    header: 'Size',
    accessorKey: 'size',
  },
  {
    id: 'actions',
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <EllipsisVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
