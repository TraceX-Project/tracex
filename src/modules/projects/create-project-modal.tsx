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
import { useRouter } from 'next/navigation';

import { SidebarMenuButton } from '@/shared/components/ui/sidebar';
import { useAppForm } from '@/shared/tanstack-form/form';
import { FilePlus } from 'lucide-react';
import React, { FormEvent, use, useCallback } from 'react';
import { projectSchema } from './_schema/schema';
import { useCreateProject } from './_hooks/use-create-project';
import { PATHS } from '@/shared/config/paths';
import { useBoolean } from '@/shared/hooks/use-boolean';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

const CreateProjectModal = () => {
  const { mutateAsync: createNewProject } = useCreateProject();
  const openDialog = useBoolean(false);
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      name: 'Untitled Project',
    },
    validators: {
      onChange: projectSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const createdProject = await createNewProject({
          name: value.name,
        });

        router.push(PATHS.projects.detail(createdProject.id));

        openDialog.setFalse();
        form.reset();

        toast.success('Project created successfully!');
      } catch (error) {
        const message =
          error instanceof AxiosError
            ? (error.response?.data?.error ?? 'An error occurred.')
            : 'Failed to create project. Please try again.';

        toast.error(message);
      }
    },
  });

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      form.handleSubmit();
    },
    [form]
  );

  const handleDialogOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        form.reset();
      }
      openDialog.setValue(isOpen);
    },
    [form, openDialog]
  );

  return (
    <Dialog open={openDialog.value} onOpenChange={handleDialogOpenChange}>
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
          <form.AppField
            name="name"
            children={(field) => <field.TextField label="Name" placeholder="Enter project name" />}
          />

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
