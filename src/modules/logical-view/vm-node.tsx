import React, { memo } from 'react';
import Image from 'next/image';
import { Handle, Position } from '@xyflow/react';

const VMNode = memo(() => {
  return (
    <div>
      <Image src="/assets/icons/vm.svg" alt="vm icon" width={36} height={36} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
});

VMNode.displayName = 'VMNode';

export default VMNode;
