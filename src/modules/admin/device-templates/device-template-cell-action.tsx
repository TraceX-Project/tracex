'use client';

import React, { useCallback } from 'react';
import { type DeviceTemplate } from './_types/device-template';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Button, buttonVariants } from '@/shared/components/ui/button';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { PATHS } from '@/shared/config/paths';
import { cn } from '@/shared/lib/cn';
import { EllipsisVertical } from 'lucide-react';
import { useBoolean } from '@/shared/hooks/use-boolean';
import { useDeleteDeviceTemplate } from './_hooks/use-delete-device-template';
import Link from 'next/link';
import { toast } from 'sonner';
import { IconPencil, IconTrash } from '@tabler/icons-react';

type Props = {
  deviceTemplate: DeviceTemplate;
};

const DeviceTemplateCellAction = ({ deviceTemplate }: Props) => {
  const { value: open, setValue: setOpen } = useBoolean(false);
  const { mutateAsync: deleteDeviceTemplate } = useDeleteDeviceTemplate();

  const handleDeleteDeviceTemplate = useCallback(async () => {
    try {
      await deleteDeviceTemplate(deviceTemplate.id);

      toast.success('Device template deleted successfully.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred.');
    }
  }, [deleteDeviceTemplate, deviceTemplate.id]);

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
            <Link href={PATHS.admin.deviceTemplates.edit(deviceTemplate.id)}>
              <IconPencil className="size-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)} variant="destructive">
            <IconTrash className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Confirm Delete"
        description={
          <>
            Do you want to delete <strong>{deviceTemplate.modelName}</strong>? This action cannot
            be undone.
          </>
        }
        onConfirm={handleDeleteDeviceTemplate}
      />
    </>
  );
};

export default DeviceTemplateCellAction;
