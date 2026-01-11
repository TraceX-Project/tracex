import React, { memo } from 'react';
import Image from 'next/image';
import { Handle, Position } from '@xyflow/react';

const StackSwitchNode = memo(() => {
  return (
    <div>
      <Image src="/assets/icons/stack-switch.svg" alt="switch icon" width={36} height={36} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
});

StackSwitchNode.displayName = 'StackSwitchNode';

export default StackSwitchNode;
