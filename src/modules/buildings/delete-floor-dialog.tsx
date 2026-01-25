import { ConfirmDialog } from '@/shared/components/confirm-dialog';
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

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Are you absolutely sure?"
      description="This action cannot be undone. This will permanently delete the selected node."
      onConfirm={handleDelete}
    />
  );
};

export default DeleteFloorDialog;