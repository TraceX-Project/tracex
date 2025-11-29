import { Button } from '@/shared/components/ui/button';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/shared/components/ui/empty';
import { FolderCode } from 'lucide-react';
import React from 'react';
import CreateFloorModal from './create-floor-modal';

const EmptyBuilding = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderCode />
        </EmptyMedia>
        <EmptyTitle>No Floor Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any floor yet. Get started by creating your first floor.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <CreateFloorModal title="Create Floor" />
      </EmptyContent>
    </Empty>
  );
};

export default EmptyBuilding;
