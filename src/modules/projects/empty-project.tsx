import { Button } from '@/shared/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/components/ui/empty';
import { PATHS } from '@/shared/config/paths';
import { FolderCode } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const EmptyProject = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderCode />
        </EmptyMedia>
        <EmptyTitle>No Projects Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any projects yet. Get started by creating your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>
          <Link href={PATHS.projects.new}>Create Project</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
};

export default EmptyProject;
