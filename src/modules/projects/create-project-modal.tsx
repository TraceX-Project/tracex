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

import { SidebarMenuButton } from '@/shared/components/ui/sidebar';
import { useAppForm } from '@/shared/tanstack-form/form';
import { FilePlus } from 'lucide-react';
import React, { FormEvent, useCallback } from 'react';
import z from 'zod';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
});

const CreateProjectModal = () => {
  const form = useAppForm({
    defaultValues: {
      name: 'Untitled Project',
    },
    validators: {
      onChange: projectSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('submit form: ', value);
      await new Promise((r) => setTimeout(r, 10000));
    },
  });

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <SidebarMenuButton
          tooltip="Create a new project"
          className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
        >
          <FilePlus className="size-4" />
          <span>New Project</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Fill in the project details. Click "Create" when you're ready.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <form.AppField name="name" children={(field) => <field.TextField label="Name" />} />

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <form.AppForm>
              <form.SubmitBtn label="Create" />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
