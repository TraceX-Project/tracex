import React, { memo } from 'react';
import Image from 'next/image';
import { Handle, Position } from '@xyflow/react';

const RouterNode = memo(() => {
  return (
    <div>
      <Image src="/assets/icons/router.svg" alt="router icon" width={36} height={36} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
});

RouterNode.displayName = 'RouterNode';

export default RouterNode;
