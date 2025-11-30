import PhysicalMapClient from '@/modules/physical-view/physical-map-client';

type Props = {
  params: Promise<{ projectId: string }>;
};

export default async function PhysicalPage({ params }: Props) {
  const { projectId } = await params;

  return <PhysicalMapClient projectId={projectId} />;
}
