import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

type Props = {
  data: {
    label: string;
  };
};

const VSwitchNode = memo(({ data }: Props) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <Handle type="target" position={Position.Top} />
      <div className="rounded border bg-white px-2 py-1 text-xs font-medium shadow-sm">
        {data.label}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

VSwitchNode.displayName = 'VSwitchNode';

export default VSwitchNode;
