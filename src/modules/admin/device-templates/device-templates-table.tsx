'use client';

import DataTable from '@/shared/components/ui/table/data-table';
import React from 'react';
import { useGetDeviceTemplates } from './_hooks/use-get-device-templates';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useDataTable } from '@/shared/hooks/use-data-table';
import { deviceTemplateColumns } from './device-template-columns';
import DataTableSkeleton from '@/shared/components/ui/table/data-table-skeleton';

const DeviceTemplatesTable = () => {
  const { data: devices, isLoading } = useGetDeviceTemplates();
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const totalDevices = devices?.data?.length ?? 0;

  const pageCount = Math.ceil(totalDevices / pageSize);

  const { table } = useDataTable({
    data: devices?.data ?? [],
    columns: deviceTemplateColumns,
    pageCount,
  });

  if (isLoading) {
    return (
      <DataTableSkeleton columnCount={6} rowCount={8} withViewOptions={false} filterCount={0} />
    );
  }

  return <DataTable table={table}></DataTable>;
};

export default DeviceTemplatesTable;
