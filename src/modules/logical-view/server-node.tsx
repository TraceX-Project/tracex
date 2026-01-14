import React, { memo } from 'react';
import Image from 'next/image';
import { Handle, Position } from '@xyflow/react';

const ServerNode = memo(() => {
  return (
    <div>
      <Image src="/assets/icons/server.svg" alt="server icon" width={36} height={36} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
});

ServerNode.displayName = 'ServerNode';

export default ServerNode;
