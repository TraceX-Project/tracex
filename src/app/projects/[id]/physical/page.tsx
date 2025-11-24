'use client';

import dynamic from 'next/dynamic';
import { use } from 'react';

type Props = {
  params: Promise<{ id: string }>;
};

const PhysicalMap = dynamic(
  () => import('@/modules/physical-view/physical-map').then((mod) => mod.PhysicalMap),
  {
    ssr: false,
  }
);

export default function PhysicalPage({ params }: Props) {
  const { id: projectId } = use(params);

  return <PhysicalMap projectId={projectId} />;
}
