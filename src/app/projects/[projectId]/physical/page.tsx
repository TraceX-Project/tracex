'use client';

import dynamic from 'next/dynamic';
import { use } from 'react';

type Props = {
  params: Promise<{ projectId: string }>;
};

const PhysicalMap = dynamic(() => import('@/modules/physical-view/physical-map'), { ssr: false });

export default function PhysicalPage({ params }: Props) {
  const { projectId } = use(params);

  return <PhysicalMap projectId={projectId} />;
}
