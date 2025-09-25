'use client';

import { type Table } from '@tanstack/react-table';
import React, { useCallback, useMemo } from 'react';

interface Props<TData> extends React.ComponentProps<'div'> {
  table: Table<TData>;
}

const DataTableToolbar = <TData,>({ table, children, className, ...props }: Props<TData>) => {
  const isFiltered = table.getState().columnFilters.length > 0;

  const columns = useMemo(
    () => table.getAllColumns().filter((column) => column.getCanFilter()),
    [table]
  );

  const onReset = useCallback(() => {
    table.resetColumnFilters();
  }, [table]);

  return <div>DataTableToolbar</div>;
};

export default DataTableToolbar;
