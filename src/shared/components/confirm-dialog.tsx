import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { buttonVariants } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/cn';
import React, { type ReactNode } from 'react';

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  onConfirm: () => Promise<void> | void;
  variant?: 'default' | 'destructive';
  isLoading?: boolean;
};

export const ConfirmDialog = ({
  open,
  onOpenChange,
  title = 'Are you absolutely sure?',
  description,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'destructive',
  isLoading = false,
}: ConfirmDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              onConfirm();
            }}
            className={cn(buttonVariants({ variant }))}
            disabled={isLoading}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
