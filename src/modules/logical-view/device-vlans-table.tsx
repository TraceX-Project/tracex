import { DeviceVlan } from "./_types/device-vlan";
import { ColumnDef } from "@tanstack/react-table";
import { useDataTable } from "@/shared/hooks/use-data-table";
import DataTable from "@/shared/components/table/data-table";
import { Separator } from "@/shared/components/ui/separator";

type Props = {
  vlans: DeviceVlan[];
};

const vlanColumns: ColumnDef<DeviceVlan>[] = [
  {
    accessorKey: 'vlanId',
    header: 'Vlan ID',
    cell: ({ row }) => <div className="font-medium">{row.original.vlanId}</div>,
  },
  {
    accessorKey: 'name',
    header: 'Vlan Name',
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
];

export const DeviceVlansTable = ({ vlans }: Props) => {
  const { table } = useDataTable({
    data: vlans,
    columns: vlanColumns,
    pageCount: 1,
  });

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <div className="text-sm font-medium leading-none">
          Vlans
        </div>
        <Separator />
      </div>

      <DataTable table={table} withPagination={false} fullHeight={true} className="h-[350px]" />
    </div>
  );
};
