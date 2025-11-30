import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { User } from '@/modules/auth/_types/user';
import ChangeRoleDialog from './change-role-dialog';
import { useBoolean } from '@/shared/hooks/use-boolean';

type Props = {
  user: User;
};

const UserCellAction = ({ user }: Props) => {
  const { value: openChangeRole, setValue: setOpenChangeRole } = useBoolean(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <EllipsisVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={() => setOpenChangeRole(true)}>Change Role</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="text-red-600 focus:bg-red-50 focus:text-red-600"
          >
            Remove User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ChangeRoleDialog user={user} open={openChangeRole} onOpenChange={setOpenChangeRole} />
    </>
  );
};

export default UserCellAction;
