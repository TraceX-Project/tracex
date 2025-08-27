'use client';
import React, { useState, useCallback } from 'react';
import '@xyflow/react/dist/style.css';
import {
  ReactFlow,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  type NodeChange,
} from '@xyflow/react';
import { nodeTypes } from '@/shared/constants/nodetype';
import dagre from '@dagrejs/dagre';
import {
  type DeviceInfo,
  type EdgeType,
  nodeHeight,
  type NodeType,
  nodeWidth,
} from './shared/constants';
import { Sidebar } from './shared/components/sidebar';
import { useGetDevicesInProject } from './_hooks/use-get-devices';

type Props = {
  id: string;
};
export const LogicalView = ({ id }: Props) => {
  const { data: devices } = useGetDevicesInProject(id);
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [edges, setEdges] = useState<EdgeType[]>([]);

  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes(
        (nds) =>
          applyNodeChanges(changes, nds).map((node) => ({
            ...node,
            type: node.type ?? '',
          })) as NodeType[]
      ),
    []
  );

  const getLayoutedElements = (
    inputNodes: NodeType[],
    inputEdges: EdgeType[],
    direction = 'TB'
  ) => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    inputNodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    inputEdges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = inputNodes.map((node) => {
      const { x, y } = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: x - nodeWidth / 2,
          y: y - nodeHeight / 2,
        },
        targetPosition: isHorizontal ? 'left' : 'top',
        sourcePosition: isHorizontal ? 'right' : 'bottom',
      };
    });

    return { nodes: layoutedNodes, edges: inputEdges };
  };

  const handleDataFromChild = (data: DeviceInfo) => {
    const newNodes: NodeType[] = [];
    const newEdges: EdgeType[] = [];

    data.nodes.forEach((node, index) => {
      const id = node.hostname;
      if (!nodes.some((n) => n.id === id)) {
        newNodes.push({
          id,
          position: { x: node.location.x || 0, y: node.location.y || 0 },
          type: node.category,
          data: {
            label: `Node ${index + 1}`,
            data: node,
          },
        });
      }
    });
    (data.edges ?? []).forEach((edge) => {
      const [a, b] = [edge.from, edge.to].sort();
      const id = `${a}-${b}`;
      if (!edges.some((e) => [e.source, e.target].sort().join('-') === id)) {
        newEdges.push({
          id,
          source: edge.from,
          target: edge.to,
        });
      }
    });

    const combinedNodes = [...nodes, ...newNodes];
    const combinedEdges = [...edges, ...newEdges];

    const layouted = getLayoutedElements(combinedNodes, combinedEdges);
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  };

  const onLayout = useCallback(
    (direction = 'TB') => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes,
        edges,
        direction
      );
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    },
    [nodes, edges]
  );

  return (
    <div className="relative h-full w-full">
      <Sidebar />
      <ReactFlow
        className="min-h-screen w-full"
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        fitView
      >
        <Background color="#ccc" variant={BackgroundVariant.Dots} />
        <Controls />
      </ReactFlow>
      {/* <AddDevice handleDataFromChild={handleDataFromChild} /> */}
    </div>
  );
};
