'use client';

import React, { type FormEvent, useCallback } from 'react';
import { Button, type buttonVariants } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { useAppForm } from '@/shared/tanstack-form/form';

import { toast } from 'sonner';
import { useCreateFloor } from '../floors/_hooks/use-create-floor';
import { useBoolean } from '@/shared/hooks/use-boolean';
import { createFloorSchema } from '../floors/_schema/floor';
import { Plus } from 'lucide-react';
import { type VariantProps } from 'class-variance-authority';
import { useParams, useRouter } from 'next/navigation';
import { PATHS } from '@/shared/config/paths';

type Props = {
  buildingId: string;
  title: string;
  variant?: VariantProps<typeof buttonVariants>['variant'];
  size?: VariantProps<typeof buttonVariants>['size'];
};

const CreateFloorModal = ({ buildingId, title, variant = 'default', size = 'default' }: Props) => {
  const { mutateAsync: createFloor } = useCreateFloor();
  const { value: open, setValue: setOpen } = useBoolean();
  const params = useParams();
  const router = useRouter();

  const {projectId} = params;
  const {floorId} = params;

  const form = useAppForm({
    defaultValues: {
      name: '',
      floorPlan: null as File | null,
    },
    validators: {
      onSubmit: createFloorSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const formData = new FormData();

        formData.append('name', value.name);

        if (value.floorPlan) {
          formData.append('file', value.floorPlan);
        }

        const result = await createFloor({
          buildingId,
          data: formData,
        });

        form.reset();
        setOpen(false);

        if (!floorId) {
          router.replace(PATHS.projects.floorView(String(projectId), buildingId, result.id));
        }

        toast.success('Floor created successfully');
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to create floor. Please try again.'
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          <Plus />
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>New Floor</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            {/* Name */}
            <form.AppField
              name="name"
              children={(field) => <field.TextField label="Name" placeholder="Enter floor name" />}
            />

            {/* Floor Plan */}
            <form.AppField
              name="floorPlan"
              children={(field) => <field.FileField label="Floor Plan" multiple={false} />}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => form.reset()}>
                Cancel
              </Button>
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

export default CreateFloorModal;
