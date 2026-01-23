import { type DeviceInterface } from './_types/logical-view';
import { type ColumnDef } from '@tanstack/react-table';
import { useDataTable } from '@/shared/hooks/use-data-table';
import DataTable from '@/shared/components/table/data-table';
import { Separator } from '@/shared/components/ui/separator';

type Props = {
  interfaces: DeviceInterface[];
};

const interfaceColumns: ColumnDef<DeviceInterface>[] = [
  {
    accessorKey: 'name',
    header: 'Interface Name',
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: 'ipAddress',
    header: 'IP Address',
    cell: ({ row }) => <div className="font-medium">{row.original.ipAddress}</div>,
  },
  {
    accessorKey: 'switchPortMode',
    header: 'Switch Port Mode',
    cell: ({ row }) => <div className="font-medium">{row.original.switchPortMode}</div>,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <div className="font-medium">{row.original.description}</div>,
  },
];

export const DeviceInterfacesTable = ({ interfaces }: Props) => {
  const { table } = useDataTable({
    data: interfaces,
    columns: interfaceColumns,
    pageCount: 1,
  });

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <div className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Interfaces
        </div>
        <Separator />
      </div>

      <DataTable table={table} withPagination={false} fullHeight={true} className="h-[350px]" />
    </div>
  );
};
