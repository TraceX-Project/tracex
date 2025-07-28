import ProjectList from '@/modules/projects/projects-list';
import SiteHeader from '@/modules/sidebar/site-header';

export default function ProjectsPage() {
  return (
    <div>
      <SiteHeader title="My Projects" />
      <div className="container mx-auto space-y-4 p-5">
        <ProjectList />
      </div>
    </div>
  );
}
