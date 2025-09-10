import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { getImageProps } from 'next/image';

interface Props extends React.ComponentProps<typeof Avatar> {
  firstname: string;
  lastname: string;
  picture: string;
  size: number;
  alt: string;
}

const UserAvatar = ({ firstname, lastname, picture, size, alt, className, ...props }: Props) => {
  const { props: nextImageProps } = getImageProps({
    src: picture,
    alt: `@${firstname}`,
    width: size,
    height: size,
  });

  const fallbackName = `${firstname.charAt(0).toUpperCase()}${lastname.charAt(0).toUpperCase()}`;

  return (
    <Avatar className={className} {...props}>
      <AvatarImage {...nextImageProps} />
      <AvatarFallback className={className}>{fallbackName}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
