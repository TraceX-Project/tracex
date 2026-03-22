import React, { memo } from 'react';
import Image from 'next/image';
import { Handle, Position } from '@xyflow/react';

import NotInRackIndicator from '@/shared/components/not-in-rack-indicator';

type Props = {
  data: {
    inRack: boolean;
  };
};

const SwitchNode = memo(({ data }: Props) => {
  return (
    <div className="relative">
      <Image src="/assets/icons/switch.svg" alt="switch icon" width={36} height={36} />
      {!data.inRack && <NotInRackIndicator />}
      <Handle type="source" position={Position.Top} id="top" className="!opacity-0" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!opacity-0" />
      <Handle type="source" position={Position.Left} id="left" className="!opacity-0" />
      <Handle type="source" position={Position.Right} id="right" className="!opacity-0" />
      <Handle type="target" position={Position.Top} id="top" className="!opacity-0" />
      <Handle type="target" position={Position.Bottom} id="bottom" className="!opacity-0" />
      <Handle type="target" position={Position.Left} id="left" className="!opacity-0" />
      <Handle type="target" position={Position.Right} id="right" className="!opacity-0" />
    </div>
  );
});

SwitchNode.displayName = 'SwitchNode';

export default SwitchNode;
