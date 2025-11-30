'use client';

import { User, UserRole } from '@/modules/auth/_types/user';
import React, { FormEvent, useCallback } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useAppForm } from '@/shared/tanstack-form/form';
import { updateRoleSchema } from './_schema/user';
import { useUpdateRole } from './_hooks/use-update-role';
import { toast } from 'sonner';

type Props = {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const roleOptions = [
  {
    label: 'Admin',
    value: UserRole.ADMIN,
  },
  {
    label: 'User',
    value: UserRole.USER,
  },
];

const ChangeRoleDialog = ({ user, open, onOpenChange }: Props) => {
  const { mutateAsync: updateRole } = useUpdateRole();
  const form = useAppForm({
    defaultValues: {
      role: user.role,
    },
    validators: {
      onSubmit: updateRoleSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateRole({
          userId: user.id,
          body: {
            role: value.role,
          },
        });
        toast.success('Role updated successfully');
        onOpenChange(false);
      } catch (error) {
        toast.error('Failed to update role');
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            {/* Role */}
            <form.AppField
              name="role"
              children={(field) => (
                <field.SelectField label="Role" placeholder="Select a role" options={roleOptions} />
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
              <form.SubmitButton>Save Changes</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeRoleDialog;
