import { useDataTable } from '@/shared/hooks/use-data-table';
import DataTable from '@/shared/components/table/data-table';
import { Separator } from '@/shared/components/ui/separator';

type Props = {
  data: DetailRow[];
  title?: string;
};

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

export const DeviceDetailsTable = ({ data, title = 'Details' }: Props) => {
  const { table } = useDataTable({
    data,
    columns: detailColumns,
    pageCount: 1,
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {title}
        </div>
        <Separator />
      </div>
      <DataTable table={table} withPagination={false} fullHeight={false} />
    </div>
  );
};
