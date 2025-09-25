import LogicalView from '@/modules/logical-view/logical-view';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LogicalViewPage({ params }: Props) {
  const { id: projectId } = await params;

  return <LogicalView projectId={projectId} />;
}
