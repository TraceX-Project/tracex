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
      <Handle type="source" position={Position.Top} id="top" className="!opacity-0" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!opacity-0" />
      <Handle type="source" position={Position.Left} id="left" className="!opacity-0" />
      <Handle type="source" position={Position.Right} id="right" className="!opacity-0" />
      <Handle type="target" position={Position.Top} id="top" className="!opacity-0" />
      <Handle type="target" position={Position.Bottom} id="bottom" className="!opacity-0" />
      <Handle type="target" position={Position.Left} id="left" className="!opacity-0" />
      <Handle type="target" position={Position.Right} id="right" className="!opacity-0" />
      <div className="rounded border bg-white px-2 py-1 text-xs font-medium shadow-sm">
        {data.label}
      </div>
    </div>
  );
});

VSwitchNode.displayName = 'VSwitchNode';

export default VSwitchNode;
