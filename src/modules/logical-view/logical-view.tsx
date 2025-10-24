'use client';
import React, { useEffect, useMemo } from 'react';
import '@xyflow/react/dist/style.css';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from '@xyflow/react';
import { useGetDevicesInProject } from './_hooks/use-get-devices';
import CreateDeviceModal from './create-device-modal';
import { NODE_TYPES } from './_constants/logical-view';
import { mapDevicesToReactFlow } from './_utils/react-flow';
import { getLayoutedElements } from './_utils/graph';
import { DeviceType } from '../admin/device-templates/_types/device-template';

type Props = {
  projectId: string;
};

const LogicalView = ({ projectId }: Props) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const mockDevices = useMemo(
    () => ({
      nodes: [
        { id: 'r1', name: 'Router 1', position: { x: 0, y: 0 }, type: DeviceType.ROUTER },
        { id: 's1', name: 'Switch 1', position: { x: 0, y: 0 }, type: DeviceType.SWITCH },
        { id: 's2', name: 'Switch 2', position: { x: 0, y: 0 }, type: DeviceType.SWITCH },
      ],
      edges: [
        { source: 'r1', target: 's1' },
        { source: 'r1', target: 's2' },
      ],
    }),
    []
  );

  const { data: devices = mockDevices } = useGetDevicesInProject(projectId);
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    if (!devices) return { nodes: [], edges: [] };

    const mappedDevices = mapDevicesToReactFlow(devices!);

    return getLayoutedElements(mappedDevices.nodes, mappedDevices.edges);
  }, [devices]);

  useEffect(() => {
    if (layoutedNodes?.length || layoutedEdges?.length) {
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [layoutedNodes, layoutedEdges, setEdges, setNodes]);

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        className="w-full"
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        nodesConnectable={false}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} />
        <Controls />
      </ReactFlow>

      <div className="absolute right-10 bottom-10 z-10">
        <CreateDeviceModal />
      </div>
    </div>
  );
};

export default LogicalView;
