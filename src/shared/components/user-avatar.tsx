import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface Props extends React.ComponentProps<typeof Avatar> {
  firstName: string;
  lastName: string;
  avatarUrl: string;
  alt: string;
  size?: number;
}

const UserAvatar = ({
  firstName,
  lastName,
  avatarUrl,
  alt,
  className,
  size = 32,
  ...props
}: Props) => {
  const fallbackName = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;

  return (
    <Avatar className={className} {...props}>
      <AvatarImage src={avatarUrl} alt={alt ?? `@${firstName}`} width={size} height={size} />
      <AvatarFallback className={className}>{fallbackName}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
