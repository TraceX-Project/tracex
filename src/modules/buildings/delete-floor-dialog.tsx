import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from '@/shared/components/ui/alert-dialog';
import { cn } from '@/shared/lib/cn';
import { buttonVariants } from '@/shared/components/ui/button';
import { useDeleteFloor } from '../floors/_hooks/use-delete-floor';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import { PATHS } from '@/shared/config/paths';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  floorId: string
}

const DeleteFloorDialog = ({ open, onOpenChange, floorId: deleteFloorId }: Props) => {
  const { mutateAsync: deleteFloor } = useDeleteFloor();

  const { projectId, buildingId, floorId: currentFloorId } = useParams<{ projectId: string, buildingId: string, floorId: string }>();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteFloor(deleteFloorId);
      onOpenChange(false);

      toast.success('Floor deleted successfully.');

      if (currentFloorId === deleteFloorId) {
        router.replace(
          PATHS.projects.buildingView(projectId, buildingId)
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete floor. Please try again.'
      );
    }
  };

  return <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the selected node.
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
};

export default DeleteFloorDialog;