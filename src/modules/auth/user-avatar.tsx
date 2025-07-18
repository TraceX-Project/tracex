'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/shared/components/ui/dropdown-menu';
import { Button } from '@/shared/components/ui/button';
import { logout } from './_service/auth.service';
import { useGetProfile } from './_hooks/use-get-profile';
import { redirect } from 'next/navigation';
import { PATHS } from '@/shared/config/paths';

const UserAvatar = () => {
  const { data: user } = useGetProfile();

  const handleLogout = async () => {
    await logout();

    redirect(PATHS.login);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative flex h-10 w-10 items-center justify-center rounded-full"
        >
          <Avatar>
            <AvatarImage src={user?.Picture} alt={`@${user?.FirstName}`} />
            <AvatarFallback className="text-black">
              {user?.FirstName[0]}
              {user?.LastName[0]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {user?.FirstName && user?.LastName && (
              <p className="text-sm font-medium leading-none">
                {user?.FirstName} {user?.LastName[0]}.
              </p>
            )}
            <p className="text-xs leading-none text-muted-foreground">{user?.Email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
