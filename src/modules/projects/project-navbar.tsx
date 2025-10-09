import { Button } from '@/shared/components/ui/button';
import { PATHS } from '@/shared/config/paths';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const ProjectNavbar = () => {
  return (
    <header className="bg-primary-foreground relative flex items-center justify-between border-b px-4 py-2">
      {/* Left */}
      <div className="flex items-center">
        <Link href={PATHS.projects.root}>
          <Button variant="ghost" size="icon">
            <ChevronLeft />
          </Button>
        </Link>
      </div>

      {/* Center */}
      <h2 className="absolute left-1/2 -translate-x-1/2 font-semibold">Title</h2>

      {/* Right */}
      <div>
        <Button size="sm">Share</Button>
      </div>
    </header>
  );
};

export default ProjectNavbar;
