import ChangingViewTabs from '@/modules/logical-view/changing-view-button';
import { getProject } from '@/modules/projects/_services/projects.service';
import ProjectNavbar from '@/modules/projects/project-navbar';
import { notFound } from 'next/navigation';

type Props = {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
};

export default async function ProjectLayout({ children, params }: Props) {
  const { projectId } = await params;

  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <ProjectNavbar project={project} />

      <div className="relative flex flex-1 flex-col">
        <div className="relative z-0 flex-1">{children}</div>

        <div className="absolute top-4 left-1/2 z-[2000] -translate-x-1/2 transform">
          <ChangingViewTabs />
        </div>
      </div>
    </div>
  );
}
