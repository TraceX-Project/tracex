'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { Button } from '@/shared/components/ui/button';
import { LayoutDashboard } from 'lucide-react';
import CytoscapeCanvas, { type CytoscapeCanvasRef } from './cytoscape-canvas';

type Props = {
  projectId: string;
};

const LogicalView = ({ projectId }: Props) => {
  const { data: devices } = useGetTopology(projectId);
  const [menu, setMenu] = useState<NodeContextMenuState | null>(null);
  const { value: isDeleteDialogOpen, setValue: setDeleteDialogOpen } = useBoolean(false);
  const { value: isDetailsOpen, setValue: setDetailsOpen } = useBoolean(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const { mutateAsync: deleteLogicalDevice } = useDeleteLogicalDevice(projectId);
  const { triggerUpdate: updateThumbnail } = useUpdateThumbnail();
  const { mutateAsync: updateDevicePositions } = useUpdateDevicePositions();
  const canvasRef = useRef<CytoscapeCanvasRef>(null);

  const topology = useMemo(() => devices ?? { nodes: [], edges: [] }, [devices]);

  const handlePositionsChange = useCallback(
    async (positions: { id: string; x: number; y: number }[]) => {
      await updateDevicePositions({ positions });
      updateThumbnail({ projectId });
    },
    [projectId, updateDevicePositions, updateThumbnail]
  );

  const handleNodeClick = useCallback((id: string) => {
    setSelectedDeviceId(id);
    setDetailsOpen(true);
  }, [setDetailsOpen]);

  const handleNodeContextMenu = useCallback((state: NodeContextMenuState) => {
    setMenu(state);
  }, []);

  const handleAutoLayout = useCallback(async () => {
    const positions = canvasRef.current?.runAutoLayout();
    if (!positions?.length) return;
    await updateDevicePositions({ positions });
    updateThumbnail({ projectId });
  }, [projectId, updateDevicePositions, updateThumbnail]);

  const onPaneClick = useCallback(() => setMenu(null), []);

  const onOpenDeleteDialog = useCallback(() => {
    if (menu) {
      setDeleteDialogOpen(true);
      setSelectedDeviceId(menu.id);
    }
  }, [menu, setDeleteDialogOpen]);

  const onOpenEditDialog = useCallback(() => {
    if (menu) setSelectedDeviceId(menu.id);
  }, [menu]);

  const handleDeleteNode = useCallback(async () => {
    try {
      await deleteLogicalDevice(selectedDeviceId!);
      setDeleteDialogOpen(false);
      updateThumbnail({ projectId, forceImmediate: true });
      toast.success('Node deleted successfully.');
    } catch {
      toast.error('Failed to delete node. Please try again.');
    }
  }, [deleteLogicalDevice, selectedDeviceId, projectId, setDeleteDialogOpen, updateThumbnail]);

  const prevNodeCountRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const currentLength = topology.nodes.length;

    // Trigger auto-layout only if nodes were added (current length > previous length)
    // and skip the initial load (prevNodeCount is undefined until first real data fetch)
    if (prevNodeCountRef.current !== undefined && currentLength > prevNodeCountRef.current) {
      const timer = setTimeout(() => {
        handleAutoLayout();
      }, 200);
      prevNodeCountRef.current = currentLength;
      return () => clearTimeout(timer);
    }

    // Only set the previous count after the initial fetch resolves
    if (devices !== undefined) {
      prevNodeCountRef.current = currentLength;
    }
  }, [topology.nodes.length, devices, handleAutoLayout]);

  return (
    <div className="relative h-full w-full" onClick={onPaneClick}>
      <CytoscapeCanvas
        ref={canvasRef}
        topology={topology}
        onNodeClick={handleNodeClick}
        onNodeContextMenu={handleNodeContextMenu}
        onPositionsChange={handlePositionsChange}
      />

      <div className="absolute top-4 right-4 z-10">
        <Button size="sm" variant="outline" onClick={handleAutoLayout}>
          <LayoutDashboard className="mr-1.5 h-4 w-4" />
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
        open={isDetailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
};

export default LogicalView;
