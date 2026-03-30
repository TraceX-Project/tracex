'use client';

import cytoscape, { type Core } from 'cytoscape';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { type Topology, type NodeContextMenuState } from './_types/logical-view';
import { DeviceType } from '../admin/device-templates/_types/device-template';


const NODE_ICON: Partial<Record<string, string>> = {
  [DeviceType.ROUTER]:         '/assets/icons/router.svg',
  [DeviceType.SWITCH]:         '/assets/icons/switch.svg',
  [DeviceType.SWITCH_STACK]:   '/assets/icons/switch.svg',
  [DeviceType.SERVER]:         '/assets/icons/server.svg',
  [DeviceType.VIRTUAL_MACHINE]:'/assets/icons/vm.svg',
  [DeviceType.VIRTUAL_SWITCH]: '/assets/icons/switch.svg',
};

// Node background color per device type
const NODE_BG: Partial<Record<string, string>> = {
  [DeviceType.ROUTER]:          '#0c1a2e',
  [DeviceType.SWITCH]:          '#0f172a',
  [DeviceType.SWITCH_STACK]:    '#0f172a',
  [DeviceType.SERVER]:          '#0c2010',
  [DeviceType.VIRTUAL_MACHINE]: '#1a0c2e',
  [DeviceType.VIRTUAL_SWITCH]:  '#0f172a',
};

type Props = {
  topology: Topology | undefined;
  onNodeClick: (id: string) => void;
  onNodeContextMenu: (state: NodeContextMenuState) => void;
  onPositionsChange: (positions: { id: string; x: number; y: number }[]) => void;
};

export type CytoscapeCanvasRef = {
  runAutoLayout: () => { id: string; x: number; y: number }[];
};



const LAYOUT_OPTIONS: cytoscape.LayoutOptions = {
  name: 'cose',
  animate: false,
  randomize: false,
  componentSpacing: 120,
  nodeRepulsion: () => 900000,
  nodeOverlap: 20,
  idealEdgeLength: () => 120,
  edgeElasticity: () => 100,
  nestingFactor: 5,
  gravity: 60,
  numIter: 1500,
  initialTemp: 200,
  coolingFactor: 0.95,
  minTemp: 1.0,
  padding: 60,
} as cytoscape.LayoutOptions;

const CytoscapeCanvas = forwardRef<CytoscapeCanvasRef, Props>(
  ({ topology, onNodeClick, onNodeContextMenu, onPositionsChange }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cyRef = useRef<Core | null>(null);
    const initialized = useRef(false);

    // Keep latest callbacks in refs so cy event handlers don't go stale
    const onNodeClickRef = useRef(onNodeClick);
    const onNodeContextMenuRef = useRef(onNodeContextMenu);
    const onPositionsChangeRef = useRef(onPositionsChange);
    useEffect(() => { onNodeClickRef.current = onNodeClick; });
    useEffect(() => { onNodeContextMenuRef.current = onNodeContextMenu; });
    useEffect(() => { onPositionsChangeRef.current = onPositionsChange; });

    const collectPositions = useCallback((cy: Core) =>
      cy.nodes().map((n) => ({
        id: n.id(),
        x: Math.round(n.position().x),
        y: Math.round(n.position().y),
      })), []);

    const runAutoLayout = useCallback((): { id: string; x: number; y: number }[] => {
      const cy = cyRef.current;
      if (!cy) return [];
      cy.layout(LAYOUT_OPTIONS).run();
      cy.fit(undefined, 60);
      return collectPositions(cy);
    }, [collectPositions]);

    useImperativeHandle(ref, () => ({ runAutoLayout }), [runAutoLayout]);

    // Initialize Cytoscape once
    useEffect(() => {
      if (!containerRef.current || initialized.current || !topology?.nodes?.length) return;

      const cy = cytoscape({
        container: containerRef.current,
        elements: {
          nodes: topology.nodes.map((n) => ({
            data: {
              id: n.id,
              label: n.name,
              type: n.type,
              inRack: n.inRack,
              icon: NODE_ICON[n.type] ?? '/assets/icons/switch.svg',
              bg: NODE_BG[n.type] ?? '#0f172a',
            },
            position: { x: n.position?.x ?? 0, y: n.position?.y ?? 0 },
          })),
          edges: topology.edges.map((e) => ({
            data: {
              id: `${e.source}-${e.target}`,
              source: e.source,
              target: e.target,
            },
          })),
        },
        style: [
          {
            selector: 'node',
            style: {
              'background-opacity': 0,
              'background-image': 'data(icon)',
              'background-fit': 'contain',
              'background-clip': 'none',
              'background-width': '100%',
              'background-height': '100%',
              'border-width': 0,
              width: 36,
              height: 36,
              label: 'data(label)',
              color: '#94a3b8',
              'font-size': 10,
              'text-valign': 'bottom',
              'text-halign': 'center',
              'text-margin-y': 5,
              'font-family': 'Inter, system-ui, sans-serif',
              'text-wrap': 'ellipsis',
              'text-max-width': '90px',
            },
          },
          {
            selector: 'node:selected',
            style: {
              'background-opacity': 0.15,
              'background-color': '#6366f1',
              'border-color': '#6366f1',
              'border-width': 2,
            },
          },
          {
            selector: 'node:active',
            style: { 'overlay-opacity': 0 },
          },
          {
            selector: 'edge',
            style: {
              width: 1.8,
              'line-color': '#475569',
              'target-arrow-shape': 'none',
              'curve-style': 'straight',
              opacity: 0.7,
            },
          },
          {
            selector: 'edge:selected',
            style: { width: 3, opacity: 1 },
          },
        ],
        layout: { name: 'preset' },
        minZoom: 0.05,
        maxZoom: 4,
        wheelSensitivity: 0.3,
        boxSelectionEnabled: false,
      });

      // Tap = click on node
      cy.on('tap', 'node', (e) => {
        onNodeClickRef.current(e.target.id());
      });

      // Right-click context menu
      cy.on('cxttap', 'node', (e) => {
        const native = e.originalEvent as MouseEvent;
        onNodeContextMenuRef.current({
          id: e.target.id(),
          x: native.clientX,
          y: native.clientY,
          type: e.target.data('type') as DeviceType,
        });
      });

      // Drag stop → save positions (debounced)
      let dragTimer: ReturnType<typeof setTimeout> | null = null;
      cy.on('dragfree', () => {
        if (dragTimer) clearTimeout(dragTimer);
        dragTimer = setTimeout(() => {
          onPositionsChangeRef.current(collectPositions(cy));
        }, 300);
      });

      cyRef.current = cy;
      initialized.current = true;

      // Auto-layout if all nodes are at origin
      const allAtOrigin = topology.nodes.every(
        (n) => (n.position?.x ?? 0) === 0 && (n.position?.y ?? 0) === 0
      );
      if (allAtOrigin) {
        cy.layout(LAYOUT_OPTIONS).run();
      }
      cy.fit(undefined, 60);

      return () => {
        if (dragTimer) clearTimeout(dragTimer);
        cy.destroy();
        cyRef.current = null;
        initialized.current = false;
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [topology?.nodes?.length]);

    // Sync topology changes after initialization (add/remove nodes & edges)
    useEffect(() => {
      const cy = cyRef.current;
      if (!cy || !topology) return;

      const existingNodeIds = new Set(cy.nodes().map((n) => n.id()));
      const incomingNodeIds = new Set(topology.nodes.map((n) => n.id));

      // Add new nodes
      topology.nodes.forEach((n) => {
        if (!existingNodeIds.has(n.id)) {
          cy.add({
            group: 'nodes',
            data: {
              id: n.id,
              label: n.name,
              type: n.type,
              inRack: n.inRack,
              icon: NODE_ICON[n.type] ?? '/assets/icons/switch.svg',
              bg: NODE_BG[n.type] ?? '#0f172a',
            },
            position: { x: 0, y: 0 },
          });
        }
      });

      // Remove deleted nodes
      cy.nodes().forEach((n) => {
        if (!incomingNodeIds.has(n.id())) cy.remove(n);
      });

      // Rebuild edges
      cy.edges().remove();
      topology.edges.forEach((e) => {
        cy.add({
          group: 'edges',
          data: {
            id: `${e.source}-${e.target}`,
            source: e.source,
            target: e.target,
          },
        });
      });
    }, [topology]);

    return (
      <div
        ref={containerRef}
        className="h-full w-full"
        onContextMenu={(e) => e.preventDefault()}
      />
    );
  }
);

CytoscapeCanvas.displayName = 'CytoscapeCanvas';

export default CytoscapeCanvas;
