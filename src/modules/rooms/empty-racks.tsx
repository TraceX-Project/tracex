'use client';
  
import React from 'react'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from '@/shared/components/ui/empty';
import { Server } from 'lucide-react';
import CreateRackModal from './create-rack-modal';

type Props = {
    roomId: string
}

const EmptyRacks = ({roomId}:Props) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Server />
        </EmptyMedia>
        <EmptyTitle>No Racks Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any racks yet. Get started by creating your first rack.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <CreateRackModal title="Create Rack" roomId={roomId} />
      </EmptyContent>
    </Empty>
  )
}

export default EmptyRacks