'use client';

import Image from 'next/image';
import { projects } from './mocks/projects';
import { Card, CardHeader, CardContent, CardTitle } from '@/shared/components/ui/card';

const ProjectList = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {projects.map((project) => (
      <Card key={project.id} className="w-full">
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
    ))}
  </div>
);

export default ProjectList;
