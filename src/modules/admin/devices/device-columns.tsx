/* eslint-disable react-hooks/rules-of-hooks */

import { type ColumnDef } from '@tanstack/react-table';
import { type Device } from './_types/device';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Button, buttonVariants } from '@/shared/components/ui/button';
import { EllipsisVertical } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { useBoolean } from '@/shared/hooks/use-boolean';
import { cn } from '@/shared/lib/cn';
import React from 'react';
import Link from 'next/link';
import { PATHS } from '@/shared/config/paths';
import { FrontPanelURLMock, BackPanelURLMock } from './_types/device';
import { useDeleteDeviceTemplate } from './_hooks/use-delete-deviceTemplates';

export const deviceColumns: ColumnDef<Device>[] = [
  {
    accessorKey: 'frontPanelUrl',
    header: 'Front Panel',
    cell: ({ row }) => {
      const frontPanel = row.getValue('frontPanelUrl');
      const modelName = row.getValue('modelName');

      return (
        <div className="relative aspect-square size-20">
          <Image
            src={(frontPanel as string) || FrontPanelURLMock}
            alt={`${modelName as string} Front Panel`}
            className="rounded-md"
            fill
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'backPanelUrl',
    header: 'Back Panel',
    cell: ({ row }) => {
      const backPanel = row.getValue('backPanelUrl');
      const modelName = row.getValue('modelName');

      return (
        <div className="relative aspect-square size-20">
          <Image
            src={(backPanel as string) || BackPanelURLMock}
            alt={`${modelName as string} Back Panel`}
            className="rounded-md"
            fill
          />
        </div>
      );
    },
  },
  {
    header: () => <div className="w-full text-left">Model Name</div>,
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
    header: 'Size',
    accessorKey: 'size',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const { mutateAsync: deleteDeviceTemplate } = useDeleteDeviceTemplate();
      const device = row.original;
      const { value: open, setValue: setOpen } = useBoolean(false);

      return (
        <React.Fragment>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                size="icon"
              >
                <EllipsisVertical />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem asChild>
                <Link href={PATHS.admin.deviceTemplates.edit(device.id)}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setOpen(true)}
                className="text-red-600 focus:bg-red-50 focus:text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                <AlertDialogDescription>
                  Do you want to delete <strong>{device.modelName}</strong>? This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={cn(buttonVariants({ variant: 'destructive' }))}
                  onClick={() => {
                    deleteDeviceTemplate(device.id);
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </React.Fragment>
      );
    },
  },
];
