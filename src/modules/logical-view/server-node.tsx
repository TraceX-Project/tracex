import React, { memo } from 'react';
import Image from 'next/image';
import { Handle, Position } from '@xyflow/react';

import NotInRackIndicator from '@/shared/components/not-in-rack-indicator';

type Props = {
  data: {
    inRack: boolean;
  };
};

const ServerNode = memo(({ data }: Props) => {
  return (
    <div className="relative">
      <Image src="/assets/icons/server.svg" alt="server icon" width={36} height={36} />
      {!data.inRack && <NotInRackIndicator />}
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
});

ServerNode.displayName = 'ServerNode';

export default ServerNode;
