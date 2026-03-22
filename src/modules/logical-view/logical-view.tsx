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
import NodeDetailsSheet from './node-details-sheet';
import { DeviceType } from '../admin/device-templates/_types/device-template';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { toast } from 'sonner';
import { useDeleteLogicalDevice } from './_hooks/use-delete-logical-device';
import { useUpdateThumbnail } from '../projects/_hooks/use-update-thumbnail';
import { useUpdateDevicePositions } from './_hooks/use-update-device-positions';
import { useBoolean } from '@/shared/hooks/use-boolean';
import { getEdgeHandles, getLayoutedPositions } from './_utils/position';
import { Button } from '@/shared/components/ui/button';
import { LayoutDashboard } from 'lucide-react';

type Props = {
  projectId: string;
};

const LogicalView = ({ projectId }: Props) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { data: devices } = useGetTopology(projectId);
  const [menu, setMenu] = useState<NodeContextMenuState | null>(null);
  const { value: isDeleteDialogOpen, setValue: setDeleteDialogOpen } = useBoolean(false);
  const { value: isDetailsValuesOpen, setValue: setDetailsValuesOpen } = useBoolean(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const { mutateAsync: deleteLogicalDevice } = useDeleteLogicalDevice(projectId);
  const { triggerUpdate: updateThumbnail } = useUpdateThumbnail();
  const { mutateAsync: updateDevicePositions } = useUpdateDevicePositions();

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    return mapDevicesToReactFlow(devices!);
  }, [devices]);

  const isInitialized = useRef(false);

  useEffect(() => {
    if (!layoutedNodes || !layoutedEdges) return;

    const layoutedPositions = getLayoutedPositions(layoutedNodes, layoutedEdges);

    const applyHandles = (
      edgeList: typeof layoutedEdges,
      posMap: Map<string, { x: number; y: number }>
    ) =>
      edgeList.map((edge) => {
        const src = posMap.get(edge.source);
        const tgt = posMap.get(edge.target);
        if (!src || !tgt) return edge;
        return { ...edge, ...getEdgeHandles(src, tgt) };
      });

    if (!isInitialized.current) {
      const connectedIds = new Set(layoutedEdges.flatMap((e) => [e.source, e.target]));
      const finalNodes = layoutedNodes.map((node) => {
        const isIsolated = !connectedIds.has(node.id);
        const isDefault = node.position.x === 0 && node.position.y === 0;
        // Isolated nodes always use the computed free-slot position to avoid edge overlap
        return {
          ...node,
          position:
            isIsolated || isDefault ? layoutedPositions.get(node.id)! : node.position,
        };
      });
      const finalPosMap = new Map(finalNodes.map((n) => [n.id, n.position]));
      setNodes(finalNodes);
      setEdges(applyHandles(layoutedEdges, finalPosMap));
      isInitialized.current = true;
    } else {
      // Preserve positions of existing nodes; auto-layout only new ones
      setNodes((currentNodes) => {
        const currentPositions = new Map(currentNodes.map((n) => [n.id, n.position]));
        const nextNodes = layoutedNodes.map((node) => ({
          ...node,
          position:
            currentPositions.get(node.id) ?? layoutedPositions.get(node.id) ?? node.position,
        }));
        const posMap = new Map(nextNodes.map((n) => [n.id, n.position]));
        setEdges(applyHandles(layoutedEdges, posMap));
        return nextNodes;
      });
    }
  }, [layoutedNodes, layoutedEdges, setEdges, setNodes]);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();

      if (!ref.current) return;

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

  const onOpenDeleteDialog = useCallback(() => {
    if (menu) {
      setDeleteDialogOpen(true);
      setSelectedDeviceId(menu.id);
    }
  }, [menu, setDeleteDialogOpen]);

  const onOpenEditDialog = useCallback(() => {
    if (menu) {
      setSelectedDeviceId(menu.id);
    }
  }, [menu]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedDeviceId(node.id);
    setDetailsValuesOpen(true);
  }, [setDetailsValuesOpen]);

  const handleDeleteNode = useCallback(async () => {
    try {
      await deleteLogicalDevice(selectedDeviceId!);
      setDeleteDialogOpen(false);
      updateThumbnail({ projectId, forceImmediate: true });

      toast.success('Node deleted successfully.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete node. Please try again.');
    }
  }, [deleteLogicalDevice, selectedDeviceId, projectId, setDeleteDialogOpen, updateThumbnail]);

  const handleAutoLayout = useCallback(async () => {
    if (!layoutedNodes || !layoutedEdges) return;

    const layoutedPositions = getLayoutedPositions(layoutedNodes, layoutedEdges);

    const updatedNodes = nodes.map((node) => ({
      ...node,
      position: layoutedPositions.get(node.id) ?? node.position,
    }));
    const posMap = new Map(updatedNodes.map((n) => [n.id, n.position]));
    const updatedEdges = layoutedEdges.map((edge) => {
      const src = posMap.get(edge.source);
      const tgt = posMap.get(edge.target);
      if (!src || !tgt) return edge;
      return { ...edge, ...getEdgeHandles(src, tgt) };
    });

    setNodes(updatedNodes);
    setEdges(updatedEdges);

    await updateDevicePositions({
      positions: updatedNodes.map((n) => ({
        id: n.id,
        x: n.position.x,
        y: n.position.y,
      })),
    });

    updateThumbnail({ projectId });
  }, [
    layoutedNodes,
    layoutedEdges,
    nodes,
    setNodes,
    updateDevicePositions,
    updateThumbnail,
    projectId,
  ]);

  const onNodeDragStop = useCallback(
    async (_e: React.MouseEvent, _node: Node) => {
      await updateDevicePositions({
        positions: nodes.map((n) => ({
          id: n.id,
          x: n.position.x,
          y: n.position.y,
        })),
      });

      updateThumbnail({ projectId });
    },
    [projectId, nodes, updateDevicePositions, updateThumbnail]
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

      <div className="absolute top-4 right-4 z-10">
        <Button size="sm" variant="outline" onClick={handleAutoLayout}>
          <LayoutDashboard />
          Auto Layout
        </Button>
      </div>

      {menu &&
        menu.type !== DeviceType.VIRTUAL_MACHINE &&
        menu.type !== DeviceType.VIRTUAL_SWITCH && (
          <NodeContextMenu
            open={!!menu}
            menu={menu}
            onClose={onPaneClick}
            onDelete={onOpenDeleteDialog}
            onEdit={onOpenEditDialog}
          />
        )}

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
