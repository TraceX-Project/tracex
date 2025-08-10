import { getProject } from '@/modules/projects/_services/projects.service';
import UpdateProjectForm from '@/modules/projects/update-project-form';
import SiteHeader from '@/modules/sidebar/site-header';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;

  const project = await getProject(id);

  return (
    <div>
      <SiteHeader title="Update project" />

      <div className="container mx-auto space-y-4 p-5 pt-20">
        <UpdateProjectForm project={project} />
      </div>
    </div>
  );
}
