import LogicalView from '@/modules/logical-view/logical-view';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LogicalPage({ params }: Props) {
  const { id } = await params;

  return <LogicalView projectId={id} />;
}
