'use client';

import Image from 'next/image';
import { Card, CardHeader, CardContent, CardTitle } from '@/shared/components/ui/card';
import Link from 'next/link';
import { PATHS } from '@/shared/config/paths';
import { useGetProjects } from './_hooks/use-get-projects';

const ProjectList = () => {
  const { data: projects, isLoading } = useGetProjects();

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading projects...</div>;
  }

  if (!projects || projects?.data?.length === 0) {
    return <div className="text-center text-gray-500">No projects found</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {projects?.data?.map((project) => (
        <Link key={project.id} href={PATHS.projects.detail(project.id)} passHref>
          <Card className="w-full cursor-pointer hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="p-0">
              <Image
                src="https://www.cisco.com/content/dam/cisco-cdc/site/images/legacy/assets/swa/img/anchor-info/network-designed-628x353.jpg"
                alt={project.name}
                width={400}
                height={250}
                className="object-cover w-full h-48"
              />
            </CardHeader>
            <CardContent>
              <CardTitle>{project.name}</CardTitle>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ProjectList;
