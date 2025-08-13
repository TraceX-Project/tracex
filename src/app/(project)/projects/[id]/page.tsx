import CaptureThumbnail from '@/modules/projects/capture-thumbnail';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <p>Project ID: {id}</p>

      <CaptureThumbnail id={id} />
    </div>
  );
}
