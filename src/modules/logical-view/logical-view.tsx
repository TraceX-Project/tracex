'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { NODE_TYPES } from './_constants/logical-view';
import { mapDevicesToReactFlow } from './_utils/react-flow';
import { getLayoutedElements } from './_utils/graph';
import { useGetTopology } from './_hooks/use-get-topology';
import { NodeContextMenuState } from './_types/logical-view';
import NodeContextMenu from './node-context-menu';
import ConnectHypervisorDialog from './connect-hypervisor-dialog';
import DeleteNodeDialog from './delete-node-dialog';

type Props = {
  projectId: string;
};

const LogicalView = ({ projectId }: Props) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { data: devices } = useGetTopology(projectId);
  const [menu, setMenu] = useState<NodeContextMenuState | null>(null);
  const [isConnectDialogOpen, setConnectDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

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

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();

      if (!ref.current) return;

      const pane = ref.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        x: event.clientX,
        y: event.clientY,
      });
    },
    [setMenu]
  );


  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  const onOpenConnectDialog = useCallback(() => {
    if (menu) {
      setConnectDialogOpen(true);
      setSelectedDeviceId(menu.id);
    }
  }, []);

  const onOpenDeleteDialog = useCallback(() => {
    if (menu) {
      setDeleteDialogOpen(true);
      setSelectedDeviceId(menu.id);
    }
  }, []);



  return (
    <div className="relative h-full w-full">
      <ReactFlow
        ref={ref}
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        nodesConnectable={false}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} />
        <Controls />
      </ReactFlow>

      {menu && (
        <NodeContextMenu
          open={!!menu}
          x={menu.x}
          y={menu.y}
          onClose={onPaneClick}
          onConnect={onOpenConnectDialog}
          onDelete={onOpenDeleteDialog}
        />
      )}

      <ConnectHypervisorDialog
        deviceId={selectedDeviceId as string}
        open={isConnectDialogOpen}
        onOpenChange={setConnectDialogOpen}
      />
      <DeleteNodeDialog
        deviceId={selectedDeviceId as string}
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </div>
  );
};

export default LogicalView;
