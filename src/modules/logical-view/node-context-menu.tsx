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
  onClose: () => void;
};

const NodeContextMenu = ({ x, y, onClose }: Props) => {
  return (
    <DropdownMenu open onOpenChange={onClose}>
      <DropdownMenuContent
        style={{
          position: 'fixed',
          top: y,
          left: x,
        }}
        className="z-50 min-w-max"
      >
        <DropdownMenuItem>
          <IconPlugConnected className="size-4" />
          <span>Connect a hypervisor</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <IconTrash className="size-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NodeContextMenu;
