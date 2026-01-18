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
import { type NodeContextMenuState } from './_types/logical-view';
import NodeContextMenu from './node-context-menu';
import ConnectHypervisorDialog from './connect-hypervisor-dialog';
import DeleteNodeDialog from './delete-node-dialog';
import NodeDetailsSheet from './node-details-sheet';
import { type DeviceType } from '../admin/device-templates/_types/device-template';


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
  const [isDetailsValuesOpen, setDetailsValuesOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    const mappedDevices = mapDevicesToReactFlow(devices!);

    return getLayoutedElements(mappedDevices.nodes, mappedDevices.edges);
  }, [devices]);

  useEffect(() => {
    if (layoutedNodes && layoutedEdges) {
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
        type: node.type as DeviceType,
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
  }, [menu]);

  const onOpenDeleteDialog = useCallback(() => {
    if (menu) {
      setDeleteDialogOpen(true);
      setSelectedDeviceId(menu.id);
    }
  }, [menu]);



  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedDeviceId(node.id);
      setDetailsValuesOpen(true);
    },
    []
  );

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
        onNodeClick={onNodeClick}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} />
        <Controls />
      </ReactFlow>

      {menu && (
        <NodeContextMenu
          open={!!menu}
          menu={menu}
          onClose={onPaneClick}
          onConnect={onOpenConnectDialog}
          onDelete={onOpenDeleteDialog}
        />
      )}

      <ConnectHypervisorDialog
        deviceId={selectedDeviceId!}
        open={isConnectDialogOpen}
        onOpenChange={setConnectDialogOpen}
      />
      <DeleteNodeDialog
        deviceId={selectedDeviceId!}
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        projectId={projectId}
      />

      <NodeDetailsSheet
        deviceId={selectedDeviceId!}
        open={isDetailsValuesOpen}
        onOpenChange={setDetailsValuesOpen}
      />
    </div>
  );
};

export default LogicalView;
