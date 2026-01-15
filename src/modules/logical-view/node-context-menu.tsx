import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/shared/components/ui/dropdown-menu';
import { IconPlugConnected, IconTrash } from '@tabler/icons-react';
import { type NodeContextMenuState } from './_types/logical-view';
import { DeviceType } from '../admin/device-templates/_types/device-template';

type Props = {
  menu: NodeContextMenuState
  open: boolean;
  onClose: () => void;
  onConnect: () => void;
  onDelete: () => void;
};

const NodeContextMenu = ({ menu, open, onClose, onConnect, onDelete }: Props) => {
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
            <DropdownMenuItem
              onClick={onConnect}
            >
              <IconPlugConnected className="size-4" />
              <span>Connect a hypervisor</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
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
