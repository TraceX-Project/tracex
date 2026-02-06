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

import { useGetTopology } from './_hooks/use-get-topology';
import { type NodeContextMenuState } from './_types/logical-view';
import NodeContextMenu from './node-context-menu';
import ConnectHypervisorDialog from './connect-hypervisor-dialog';
import NodeDetailsSheet from './node-details-sheet';
import { DeviceType } from '../admin/device-templates/_types/device-template';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { toast } from 'sonner';
import { useDeleteLogicalDevice } from './_hooks/use-delete-logical-device';
import { useUpdateThumbnail } from '../projects/_hooks/use-update-thumbnail';
import { useUpdateDevicePositions } from './_hooks/use-update-device-positions';

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
  const { mutateAsync: deleteLogicalDevice } = useDeleteLogicalDevice(projectId);
  const { mutateAsync: updateThumbnail } = useUpdateThumbnail();
  const { mutateAsync: updateDevicePositions } = useUpdateDevicePositions();

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    return mapDevicesToReactFlow(devices!);
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

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedDeviceId(node.id);
    setDetailsValuesOpen(true);
  }, []);

  const handleDeleteNode = useCallback(async () => {
    try {
      await deleteLogicalDevice(selectedDeviceId!);
      setDeleteDialogOpen(false);

      toast.success('Node deleted successfully.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete node. Please try again.');
    }
  }, [deleteLogicalDevice, selectedDeviceId]);

  const onNodeDragStop = useCallback(
    async (e: React.MouseEvent, node: Node) => {
      await updateDevicePositions({
        positions: [{
          id: node.id,
          x: node.position.x,
          y: node.position.y,
        }]
      })

      await updateThumbnail({ projectId });
    },
    [projectId, updateDevicePositions, updateThumbnail]
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
        onNodeDragStop={onNodeDragStop}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} />
        <Controls />
      </ReactFlow>

      {menu && menu.type !== DeviceType.VIRTUAL_MACHINE && (
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

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete the selected node."
        onConfirm={handleDeleteNode}
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
