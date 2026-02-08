import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/shared/components/ui/dropdown-menu';
import { IconEdit, IconPlugConnected, IconRefresh, IconTrash } from '@tabler/icons-react';
import { type NodeContextMenuState } from './_types/logical-view';
import { DeviceType } from '../admin/device-templates/_types/device-template';
import { useSyncVms } from './_hooks/use-sync-vms';
import { cn } from '@/shared/lib/cn';
import { toast } from 'sonner';
import { useCallback } from 'react';

type Props = {
  menu: NodeContextMenuState;
  open: boolean;
  onClose: () => void;
  onConnect: () => void;
  onDelete: () => void;
  onEdit: () => void;
};

const NodeContextMenu = ({ menu, open, onClose, onConnect, onDelete, onEdit }: Props) => {
  const { mutateAsync: syncVms, isPending: isSyncing } = useSyncVms();

  const handleSyncServer = useCallback(async () => {
    try {
      await syncVms({
        serverId: menu.id,
      });

      onClose();

      toast.success('Synced server successfully');
    } catch (error) {
      console.error(error);

      toast.error('Failed to sync server');
    }
  }, [syncVms]);

  return (
    <DropdownMenu open={open} onOpenChange={onClose}>
      <DropdownMenuContent
        style={{
          position: 'fixed',
          top: menu.y,
          left: menu.x,
        }}
        className="z-50 min-w-max"
      >
        {menu.type !== DeviceType.SERVER && (
          <>
            <DropdownMenuItem onClick={onConnect}>
              <IconPlugConnected className="size-4" />
              <span>Connect a hypervisor</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {menu.type === DeviceType.SERVER && (
          <>
            <DropdownMenuItem onClick={onEdit}>
              <IconEdit className="size-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled={isSyncing} onClick={handleSyncServer}>
              <IconRefresh className={cn('size-4', isSyncing && 'animate-spin')} />
              <span>Sync</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          <IconTrash className="size-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NodeContextMenu;
