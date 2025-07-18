import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import React from 'react';
import { getUserProfile } from './_service/users.service';

const UserAvatar = async () => {
  const user = await getUserProfile();

  return (
    <Avatar>
      <AvatarImage src={user?.Picture} alt={`@${user?.FirstName}`} />
      <AvatarFallback>
        {user?.FirstName[0]}
        {user?.LastName[0]}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
