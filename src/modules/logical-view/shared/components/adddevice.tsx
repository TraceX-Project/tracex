'use client';
import React, { useCallback } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useAppForm } from '@/shared/tanstack-form/form';
import { useBoolean } from '@/shared/hooks/use-boolean';

export const AddDevice = () => {
  const { value: isOpen, toggle: toggleIsOpen } = useBoolean(false);
  const form = useAppForm({
    defaultValues: {
      model: '',
      location: '',
      files: [] as File[],
    },
    onSubmit: async ({ value }) => {
      console.log('Form submitted with values:', value);
    },
  });
  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      form.handleSubmit();
    },
    [form]
  );
  return (
    <Dialog open={isOpen} onOpenChange={toggleIsOpen}>
      <DialogTrigger asChild>
        <Button className="absolute right-10 bottom-30 z-10 bg-teal-300" size="lg">
          <Plus strokeWidth={'3px'} color="white" />
        </Button>
      </DialogTrigger>
      <form onSubmit={handleSubmit}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Add device</DialogTitle>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <form.AppField
                name="model"
                children={(field) => (
                  <field.TextField label="Model" placeholder="Enter device name" />
                )}
              />
            </div>
            <div className="grid gap-3">
              <form.AppField
                name="location"
                children={(field) => (
                  <field.TextField label="Location" placeholder="Enter device location" />
                )}
              />
            </div>
            <div className="grid gap-3">
              {/* <form.AppField
                name="files"
                children={(field) => (
                  <field.FileField
                    label="Upload Files"
                    accept={{ 'text/plain': ['.txt'] }}
                    multiple={true}
                    maxFiles={10}
                    maxSize={10 * 1024 * 1024} // 10 MB
                    disabled={false}
                  />
                )}
              /> */}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
