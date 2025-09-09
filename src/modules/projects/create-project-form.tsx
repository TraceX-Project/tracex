'use client';

import React, { type FormEvent, useCallback } from 'react';
import { useCreateProject } from './_hooks/use-create-project';
import { useRouter } from 'next/navigation';
import { useAppForm } from '@/shared/tanstack-form/form';
import { projectSchema } from './_schema/schema';
import { PATHS } from '@/shared/config/paths';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

const CreateProjectForm = () => {
  const { mutateAsync: createNewProject } = useCreateProject();
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      name: '',
    },
    validators: {
      onChange: projectSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const createdProject = await createNewProject({
          name: value.name,
        });

        router.push(PATHS.projects.logical(createdProject.id));

        form.reset();

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
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">Create New Project</CardTitle>
        <CardDescription>
          Fill in the project details below to get started. Once created, you’ll be redirected to
          the project page.
        </CardDescription>
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
            <form.SubmitButton>Create</form.SubmitButton>
          </form.AppForm>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateProjectForm;
