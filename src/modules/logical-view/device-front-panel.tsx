import Image from 'next/image';

type Props = {
  src: string;
  alt: string;
};

export const DeviceFrontPanel = ({ src, alt }: Props) => {
  if (!src) return null;

  return (
    <div className="group from-background to-muted/50 relative aspect-video w-full overflow-hidden rounded-xl border bg-gradient-to-b shadow-sm transition-all hover:shadow-md">
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </div>
  );
};
