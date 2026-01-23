import { type ColumnDef } from '@tanstack/react-table';
import React from 'react';

export type DetailRow = {
  id: string;
  attribute: React.ReactNode;
  value: React.ReactNode;
};

export const detailColumns: ColumnDef<DetailRow>[] = [
  {
    accessorKey: 'attribute',
    header: 'Attribute',
    cell: ({ row }) => <div className="text-muted-foreground">{row.original.attribute}</div>,
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => <div className="font-medium">{row.original.value}</div>,
  },
];
