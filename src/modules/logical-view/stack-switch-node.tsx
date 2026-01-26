import React, { memo } from 'react';
import Image from 'next/image';
import { Handle, Position } from '@xyflow/react';

import NotInRackIndicator from '@/shared/components/not-in-rack-indicator';

type Props = {
  data: {
    inRack: boolean;
  };
};

const StackSwitchNode = memo(({ data }: Props) => {
  return (
    <div className="relative">
      <Image src="/assets/icons/stack-switch.svg" alt="switch icon" width={36} height={36} />
      {!data.inRack && <NotInRackIndicator />}
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
});

StackSwitchNode.displayName = 'StackSwitchNode';

export default StackSwitchNode;
