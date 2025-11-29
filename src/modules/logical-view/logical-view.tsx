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
import { NODE_TYPES } from './_constants/logical-view';
import { mapDevicesToReactFlow } from './_utils/react-flow';
import { getLayoutedElements } from './_utils/graph';

type Props = {
  projectId: string;
};

const LogicalView = ({ projectId }: Props) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { data: devices } = useGetDevicesInProject(projectId);

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
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
    </div>
  );
};

export default LogicalView;
