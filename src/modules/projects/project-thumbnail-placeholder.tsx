import { cn } from '@/shared/lib/cn';
import { type ComponentProps } from 'react';

type Props = ComponentProps<'div'>;

const ProjectThumbnailPlaceholder = ({ className, style, ...props }: Props) => {
  return (
    <div
      className={cn("bg-white", className)}
      style={{
        backgroundImage: `linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
          linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
          linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)`,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        ...style,
      }}
      {...props}
    />
  );
};

export default ProjectThumbnailPlaceholder;
