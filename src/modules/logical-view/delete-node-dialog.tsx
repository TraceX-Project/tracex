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
import { useDeleteLogicalDevice } from './_hooks/use-delete-logical-device';
import { toast } from 'sonner';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceId: string;
  projectId: string;
};

const DeleteNodeDialog = ({ open, onOpenChange, deviceId, projectId }: Props) => {
  const { mutateAsync: deleteLogicalDevices } = useDeleteLogicalDevice(projectId);

  const handleDelete = () => {
    try {
      deleteLogicalDevices(deviceId);
      onOpenChange(false);

      toast.success('Node deleted successfully.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete node. Please try again.');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            selected node.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className={cn(buttonVariants({ variant: 'destructive' }))}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteNodeDialog;
