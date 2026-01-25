'use client';

import React, { type FormEvent, useCallback, useEffect } from 'react';
import { useUpdateProject } from './_hooks/use-update-project';
import { useAppForm } from '@/shared/tanstack-form/form';
import { projectSchema } from './_schema/schema';
import { toast } from 'sonner';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { type Project } from './_types/projects';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
};

const EditProjectModal = ({ open, onOpenChange, project }: Props) => {
  const { mutateAsync: updateProject } = useUpdateProject();

  const form = useAppForm({
    defaultValues: {
      name: project.name,
    },
    validators: {
      onSubmit: projectSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateProject({
          projectId: project.id,
          data: {
            name: value.name,
          },
        });

        form.reset();
        onOpenChange(false);
        toast.success('Project updated successfully!');
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred while updating the project.'
        );
      }
    },
  });

  useEffect(() => {
    if (open) {
      form.setFieldValue('name', project.name);
    }
  }, [open, project, form]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
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
              <form.SubmitButton>Save Changes</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectModal;
