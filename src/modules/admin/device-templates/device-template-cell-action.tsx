'use client';

import React from 'react';
import { type DeviceTemplate } from './_types/device-template';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Button, buttonVariants } from '@/shared/components/ui/button';
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
} from '@/shared/components/ui/alert-dialog';
import { PATHS } from '@/shared/config/paths';
import { cn } from '@/shared/lib/cn';
import { EllipsisVertical } from 'lucide-react';
import { useBoolean } from '@/shared/hooks/use-boolean';
import { useDeleteDeviceTemplate } from './_hooks/use-delete-device-templates';
import Link from 'next/link';

type Props = {
  deviceTemplate: DeviceTemplate;
};

const DeviceTemplateCellAction = ({ deviceTemplate }: Props) => {
  const { value: open, setValue: setOpen } = useBoolean(false);
  const { mutateAsync: deleteDeviceTemplate } = useDeleteDeviceTemplate();

  return (
    <>
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
            <Link href={PATHS.admin.deviceTemplates.edit(deviceTemplate.id)}>Edit</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)} variant="destructive">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to delete <strong>{deviceTemplate.modelName}</strong>? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={cn(buttonVariants({ variant: 'destructive' }))}
              onClick={() => {
                deleteDeviceTemplate(deviceTemplate.id);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeviceTemplateCellAction;
