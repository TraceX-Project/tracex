'use client';

import React, { type FormEvent, useCallback } from 'react';
import { projectSchema } from './_schema/schema';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { useAppForm } from '@/shared/tanstack-form/form';
import { useUpdateProject } from './_hooks/use-update-project';
import { type Project } from './_types/projects';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { PATHS } from '@/shared/config/paths';

type Props = {
  project: Project;
};

const UpdateProjectForm = ({ project }: Props) => {
  const { mutateAsync: updateProject } = useUpdateProject();
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      name: project.name,
    },
    validators: {
      onChange: projectSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateProject({
          projectId: project.id,
          data: {
            name: value.name,
          },
        });

        router.push(PATHS.projects.root);

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

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">Update Project</CardTitle>
        <CardDescription>Modify the details of your existing project.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <form.AppField
            name="name"
            children={(field) => <field.TextField label="Name" placeholder="Enter project name" />}
          />

          {/* Submit Button */}
          <form.AppForm>
            <form.SubmitButton>Update Project</form.SubmitButton>
          </form.AppForm>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdateProjectForm;
