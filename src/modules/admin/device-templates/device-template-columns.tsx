import { type ColumnDef } from '@tanstack/react-table';
import { type DeviceTemplate } from './_types/device-template';
import Image from 'next/image';
import { Badge } from '@/shared/components/ui/badge';
import React from 'react';
import DeviceTemplateCellAction from './device-template-cell-action';

export const deviceTemplateColumns: ColumnDef<DeviceTemplate>[] = [
  {
    accessorKey: 'frontPanelUrl',
    header: 'Front Panel',
    cell: ({ row }) => {
      return (
        <div className="relative w-120 h-24 mx-10">
          <Image
            src={row.getValue('frontPanelUrl')}
            alt={row.getValue('modelName')}
            className="rounded-md"
            style={{ objectFit: 'contain', width: '100%', height: '100%' }}
            width={480}
            height={96}
          />
        </div>
      );
    },
  },
  {
    header: 'Model Name',
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
    header: 'Unit Size',
    accessorKey: 'unitSize',
  },
  {
    id: 'actions',
    cell: ({ row }) => <DeviceTemplateCellAction deviceTemplate={row.original} />,
  },
];
