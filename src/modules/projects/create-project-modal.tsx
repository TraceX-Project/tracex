'use client';

import React, { type FormEvent, useCallback } from 'react';
import { useCreateProject } from './_hooks/use-create-project';
import { useRouter } from 'next/navigation';
import { useAppForm } from '@/shared/tanstack-form/form';
import { projectSchema } from './_schema/schema';
import { PATHS } from '@/shared/config/paths';
import { toast } from 'sonner';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useProjectModalStore } from './_store/project-modal.store';
import { Button } from '@/shared/components/ui/button';

const CreateProjectForm = () => {
  const { mutateAsync: createNewProject } = useCreateProject();
  const isOpen = useProjectModalStore((state) => state.isOpen);
  const { setIsOpen } = useProjectModalStore((state) => state.actions);
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      name: '',
    },
    validators: {
      onSubmit: projectSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const createdProject = await createNewProject({
          name: value.name,
        });

        router.push(PATHS.projects.logical(createdProject.id));

        form.reset();

        setIsOpen(false);

        toast.success('Project created successfully!');
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred while creating the project.'
        );
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

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <DialogContent className="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          {/* Name */}
          <form.AppField
            name="name"
            children={(field) => <field.TextField label="Name" placeholder="Enter project name" />}
          />

          {/* Submit Button */}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <form.AppForm>
              <form.SubmitButton>Create</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectForm;
