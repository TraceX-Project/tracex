'use client';

import { Button } from '@/shared/components/ui/button';
import { PATHS } from '@/shared/config/paths';
import { ChevronLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Project } from './_types/projects';
import CreateDeviceModal from '../logical-view/create-device-modal';
import { IconFileExport } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';

type Props = {
  project: Project;
};

const ProjectNavbar = ({ project }: Props) => {
  const pathname = usePathname();

  console.log('Current pathname:', pathname);
  console.log('Project logical path:', PATHS.projects.logical(''));
  console.log('Project physical path:', PATHS.projects.physical(''));

  const renderButtons = () => {
    if (pathname.includes(PATHS.projects.logical(project.id))) {
      return <CreateDeviceModal />;
    }

    if (pathname.includes(PATHS.projects.physical(project.id))) {
      return null;
    }
  };

  return (
    <header className="bg-primary-foreground relative flex items-center justify-between border-b px-4 py-2">
      {/* Left */}
      <div className="flex items-center">
        <Link href={PATHS.projects.root}>
          <Button variant="ghost" size="icon">
            <ChevronLeft />
          </Button>
        </Link>
        <h2 className="font-semibold">{project.name}</h2>
      </div>

      {/* Right */}
      <div className="space-x-2.5">
        {renderButtons()}

        <Button size="sm" variant="outline">
          <Share2 className="h-4 w-4" />
        </Button>

        <Button size="sm" variant="outline">
          <IconFileExport size={16} />
        </Button>
      </div>
    </header>
  );
};

export default ProjectNavbar;
