import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/shared/components/ui/dropdown-menu';
import { IconPlugConnected, IconTrash } from '@tabler/icons-react';

type Props = {
  x: number;
  y: number;
  open: boolean;
  onClose: () => void;
  onConnect: () => void;
  onDelete: () => void;
};

const NodeContextMenu = ({ x, y, open, onClose, onConnect, onDelete }: Props) => {
  return (
    <DropdownMenu open={open} onOpenChange={onClose}>
      <DropdownMenuContent
        style={{
          position: 'fixed',
          top: y,
          left: x,
        }}
        className="z-50 min-w-max"
      >
        <DropdownMenuItem
          onClick={onConnect}
        >
          <IconPlugConnected className="size-4" />
          <span>Connect a hypervisor</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={onDelete}
        >
          <IconTrash className="size-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NodeContextMenu;
