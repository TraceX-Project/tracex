import React from 'react';
// import switchIcon from '@/../public/switch-svgrepo-com.svg'
import { Handle, Position } from '@xyflow/react';
export const Switchnode = () => {
  return (
    <div className="switch-node">
      {/* <Image src={switchIcon} alt='switch-image' width={50} height={50} /> */}
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
};
