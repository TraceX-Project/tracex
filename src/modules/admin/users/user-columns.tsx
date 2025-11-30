import { type User } from '@/modules/auth/_types/user';
import UserAvatar from '@/shared/components/user-avatar';
import { type ColumnDef } from '@tanstack/react-table';
import UserCellAction from './user-cell-action';

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'avatarUrl',
    header: 'Avatar',
    cell: ({ row }) => {
      const avatarUrl = row.getValue<string>('avatarUrl');
      const {firstName} = row.original;
      const {lastName} = row.original;

      return (
        <UserAvatar
          firstName={firstName}
          lastName={lastName}
          avatarUrl={avatarUrl}
          alt={`${firstName} ${lastName}`}
          size={80}
          className="h-20 w-20 rounded-md"
        />
      );
    },
  },
  {
    header: 'Full Name',
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
  },
  {
    header: 'Email',
    accessorKey: 'email',
  },
  {
    header: 'Role',
    accessorKey: 'role',
  },
  {
    id: 'actions',
    cell: ({ row }) => <UserCellAction user={row.original} />,
  },
];
