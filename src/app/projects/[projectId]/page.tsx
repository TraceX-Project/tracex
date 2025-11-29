import LogicalView from '@/modules/logical-view/logical-view';

type Props = {
  params: Promise<{ projectId: string }>;
};

export default async function LogicalViewPage({ params }: Props) {
  const { projectId } = await params;

  return <LogicalView projectId={projectId} />;
}
