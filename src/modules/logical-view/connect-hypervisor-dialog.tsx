"use client"

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useAppForm } from '@/shared/tanstack-form/form';
import React, { FormEvent, useCallback } from 'react';
import { toast } from 'sonner';
import { connectHypervisorSchema } from './_schema/schema';

import { HypervisorVendor } from './_types/logical-view';
import { useParams } from 'next/navigation';
import { useGetLogicalDevices } from './_hooks/use-get-logical-devices';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceId: string;
};

const ConnectHypervisorDialog = ({ open, onOpenChange, deviceId }: Props) => {
  const { projectId } = useParams<{ projectId: string }>()
  const { data: devices } = useGetLogicalDevices(projectId)

  const form = useAppForm({
    defaultValues: {
      name: '',
      apiKey: '',
      vendor: '' as HypervisorVendor,
      apiUrl: '',
      connectPortIds: [] as string[],
    },
    validators: {
      onSubmit: connectHypervisorSchema,
    },
    onSubmit: ({ value }) => {
      try {
        console.log(value)
      } catch (error) {
        toast.error('Failed to connect hypervisor. Please try again.');
      }
    },
  })

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onAbort={handleSubmit} className='space-y-4'>
          <DialogHeader>
            <DialogTitle>Connect to a hypervisor</DialogTitle>
            <DialogDescription>
              Once connect, the system will pull VMs information using the API key given.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {/* Name  */}
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField
                  label="Name"
                  placeholder="Enter name"
                />
              )}
            />

            {/* API URL */}
            <form.AppField
              name="apiUrl"
              children={(field) => (
                <field.TextField
                  label="API URL"
                  placeholder="Enter API URL"
                  type="url"
                />
              )}
            />

            {/* API Key */}
            <form.AppField
              name="apiKey"
              children={(field) => (
                <field.TextField
                  label="API Key"
                  placeholder="Enter API Key"
                  type="password"
                />
              )}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => form.reset()}>
                Cancel
              </Button>
            </DialogClose>

            <form.AppForm>
              <form.SubmitButton>Connect</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectHypervisorDialog;
