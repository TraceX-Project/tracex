'use client';

import DataTable from '@/shared/components/ui/table/data-table';
import React from 'react';
import { useGetDeviceTemplates } from './_hooks/use-get-deviceTemplates';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useDataTable } from '@/shared/hooks/use-data-table';
import { deviceColumns } from './device-columns';

const DevicesTable = () => {
  const { data: devices } = useGetDeviceTemplates();
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const totalDevices = devices?.data?.length ?? 0;

  const pageCount = Math.ceil(totalDevices / pageSize);

  const { table } = useDataTable({
    data: devices?.data ?? [],
    columns: deviceColumns,
    pageCount,
    shallow: false,
    debounceMs: 500,
  });

  return <DataTable table={table}></DataTable>;
};

export default DevicesTable;
