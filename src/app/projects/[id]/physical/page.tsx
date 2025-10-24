'use client';

import dynamic from 'next/dynamic';

const PhysicalMap = dynamic(
  () => import('@/modules/physical-view/physical-map').then((mod) => mod.PhysicalMap),
  {
    ssr: false,
  }
);

export default function PhysicalPage() {
  return <PhysicalMap />;
}
