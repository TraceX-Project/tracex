import CreateProjectForm from '@/modules/projects/create-project-form';
import SiteHeader from '@/modules/sidebar/site-header';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Create New Project',
    description: 'Create a new project',
  };
}

export default function CreateNewProjectPage() {
  return (
    <div>
      <SiteHeader title="Create new project" />

      <div className="container mx-auto space-y-4 p-5 pt-20">
        <CreateProjectForm />
      </div>
    </div>
  );
}
