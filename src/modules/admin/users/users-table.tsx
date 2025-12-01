'use client';

import React from 'react';
import { useGetUsers } from './_hooks/use-get-users';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useDataTable } from '@/shared/hooks/use-data-table';
import { userColumns } from './user-columns';
import DataTableSkeleton from '@/shared/components/table/data-table-skeleton';
import DataTable from '@/shared/components/table/data-table';

const UsersTable = () => {
  const { data: users, isLoading } = useGetUsers();
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const totalUsers = users?.length ?? 0;

  const pageCount = Math.ceil(totalUsers / pageSize);

  const { table } = useDataTable({
    data: users ?? [],
    columns: userColumns,
    pageCount,
  });

  if (isLoading) {
    return (
      <DataTableSkeleton columnCount={4} rowCount={8} withViewOptions={false} filterCount={0} />
    );
  }

  return <DataTable table={table} />;
};

export default UsersTable;
