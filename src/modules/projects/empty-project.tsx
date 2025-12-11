'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/components/ui/empty';
import { FolderCode } from 'lucide-react';
import React from 'react';
import { useProjectModalStore } from './_store/project-modal.store';

const EmptyProject = () => {
  const { setIsOpen } = useProjectModalStore((state) => state.actions);

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
        <Button onClick={() => setIsOpen(true)}>Create Project</Button>
      </EmptyContent>
    </Empty>
  );
};

export default EmptyProject;
