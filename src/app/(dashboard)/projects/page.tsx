import ProjectList from '@/modules/projects/projects-list';
import SiteHeader from '@/modules/sidebar/site-header';
import { type Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'My Projects',
    description: 'View and manage all your projects',
  };
}

export default function ProjectsPage() {
  return (
    <div>
      <SiteHeader title="My Projects" />
      <div className="container mx-auto space-y-4 p-5 pt-20">
        <ProjectList />
      </div>
    </div>
  );
}
