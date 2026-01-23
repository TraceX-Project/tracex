import { cn } from '@/shared/lib/cn';
import { flexRender, type Table as TanstackTable } from '@tanstack/react-table';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { ScrollArea, ScrollBar } from '@/shared/components/ui/scroll-area';
import DataTablePagination from './data-table-pagination';
import { getCommonPinningStyles } from '@/shared/utils/data-table';

interface Props<TData> extends React.ComponentProps<'div'> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  withPagination?: boolean;
  fullHeight?: boolean;
}

const DataTable = <TData,>({
  table,
  actionBar,
  children,
  withPagination = true,
  fullHeight = true,
  className,
  ...props
}: Props<TData>) => {
  return (
    <div
      className={cn('flex flex-col space-y-4', fullHeight ? 'flex-1' : 'w-full', className)}
      {...props}
    >
      {children}
      <div className={cn('relative flex', fullHeight ? 'flex-1' : '')}>
        <div
          className={cn(
            'flex overflow-hidden rounded-lg border',
            fullHeight ? 'absolute inset-0' : 'w-full'
          )}
        >
          <ScrollArea className="h-full w-full">
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          ...getCommonPinningStyles({ column: header.column }),
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          style={{
                            ...getCommonPinningStyles({ column: cell.column }),
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
      {withPagination && (
        <div className="flex flex-col gap-2.5">
          <DataTablePagination table={table} />
          {actionBar && table.getFilteredSelectedRowModel().rows.length > 0 && actionBar}
        </div>
      )}
    </div>
  );
};

export default DataTable;
