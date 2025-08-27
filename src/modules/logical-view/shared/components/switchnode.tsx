import React from 'react';
import Image from 'next/image';
import { Handle, Position } from '@xyflow/react';

export const Switchnode = () => {
  return (
    <div className="switch-node">
      <Image src="/switch.svg" alt="switch-image" width={50} height={50} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
};
