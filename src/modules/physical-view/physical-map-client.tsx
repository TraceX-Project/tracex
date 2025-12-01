'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import PhysicalMapSkeleton from './physical-map-skeleton';

type Props = {
  projectId: string;
};

const PhysicalMap = dynamic(() => import('./physical-map'), {
  ssr: false,
  loading: () => <PhysicalMapSkeleton />,
});

const PhysicalMapClient = ({ projectId }: Props) => {
  return (
    <Suspense fallback={<PhysicalMapSkeleton />}>
      <PhysicalMap projectId={projectId} />
    </Suspense>
  );
};

export default PhysicalMapClient;
