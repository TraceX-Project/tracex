'use client';

import Image from 'next/image';

type Props = {
  planUrl?: string | null;
};

const FloorPlanDisplay = ({ planUrl }: Props) => {
  if (!planUrl) {
    return <div className="flex h-full items-center justify-center">No floor plan</div>;
  }

  return (
    <div className="relative h-full w-full">
      <Image src={planUrl} alt="Floor Plan" fill style={{ objectFit: 'contain' }} priority />
    </div>
  );
};

export default FloorPlanDisplay;
