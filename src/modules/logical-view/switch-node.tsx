import React, { memo } from 'react';
import Image from 'next/image';
import { Handle, Position } from '@xyflow/react';

const SwitchNode = memo(() => {
  return (
    <div>
      <Image src="/assets/icons/switch.svg" alt="switch icon" width={36} height={36} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
});

SwitchNode.displayName = 'SwitchNode';

export default SwitchNode;
