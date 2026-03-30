'use client';

import cytoscape, { type Core, type NodeSingular } from 'cytoscape';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { type Topology, type NodeContextMenuState } from './_types/logical-view';
import { DeviceType } from '../admin/device-templates/_types/device-template';

// Icon SVG file path per device type
const NODE_ICON_PATH: Partial<Record<string, string>> = {
  [DeviceType.ROUTER]: '/assets/icons/router.svg',
  [DeviceType.SWITCH]: '/assets/icons/switch.svg',
  [DeviceType.SWITCH_STACK]: '/assets/icons/switch.svg',
  [DeviceType.SERVER]: '/assets/icons/server.svg',
  [DeviceType.VIRTUAL_MACHINE]: '/assets/icons/vm.svg',
  [DeviceType.VIRTUAL_SWITCH]: '/assets/icons/switch.svg',
};

// Node background color per device type (all white as requested)
const NODE_BG: Partial<Record<string, string>> = {
  [DeviceType.ROUTER]: '#ffffff',
  [DeviceType.SWITCH]: '#ffffff',
  [DeviceType.SWITCH_STACK]: '#ffffff',
  [DeviceType.SERVER]: '#ffffff',
  [DeviceType.VIRTUAL_MACHINE]: '#ffffff',
  [DeviceType.VIRTUAL_SWITCH]: '#ffffff',
};

// --- Inline SVG rendering for centered icons ---
const NODE_SIZE = 56;
const ICON_PADDING = 10; // padding around the icon inside the node

const svgCache = new Map<string, string>();

/**
 * Render an inline SVG with the icon centered inside a background rectangle.
 * Returns a base64 data URI.
 */
async function renderNodeSvg(iconPath: string, bgColor: string): Promise<string> {
  const cacheKey = `${iconPath}::${bgColor}`;
  const cached = svgCache.get(cacheKey);
  if (cached) return cached;

  const res = await fetch(iconPath);
  const raw = await res.text();

  // Extract the inner SVG content and viewBox
  const viewBoxMatch = /viewBox="([^"]+)"/.exec(raw);
  const viewBox = viewBoxMatch?.[1] ?? '0 0 32 32';

  // Strip XML declaration and outer <svg> wrapper, keep inner content
  const innerContent = raw
    .replace(/<\?xml[^?]*\?>\s*/g, '')
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '');

  const p = ICON_PADDING;
  const iconArea = NODE_SIZE - p * 2;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${NODE_SIZE}" height="${NODE_SIZE}">
    <rect x="0" y="0" width="${NODE_SIZE}" height="${NODE_SIZE}" rx="6" ry="6" fill="${bgColor}"/>
    <svg x="${p}" y="${p}" width="${iconArea}" height="${iconArea}" viewBox="${viewBox}">
      ${innerContent}
    </svg>
  </svg>`;

  const dataUri = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
  svgCache.set(cacheKey, dataUri);
  return dataUri;
}

/**
 * Pre-build SVG data URIs for all device types.
 * Returns a map of deviceType → data URI.
 */
async function buildNodeIcons(): Promise<Map<string, string>> {
  const entries = Object.entries(NODE_ICON_PATH) as [string, string][];
  const map = new Map<string, string>();
  await Promise.all(
    entries.map(async ([type, path]) => {
      const bg = NODE_BG[type] ?? '#0f172a';
      map.set(type, await renderNodeSvg(path, bg));
    })
  );
  return map;
}

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
  componentSpacing: 250,
  nodeRepulsion: () => 4000000,
  nodeOverlap: 50,
  idealEdgeLength: () => 250,
  edgeElasticity: () => 50,
  nestingFactor: 5,
  gravity: 20,
  numIter: 1500,
  initialTemp: 200,
  coolingFactor: 0.95,
  minTemp: 1.0,
  padding: 80,
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
    useEffect(() => {
      onNodeClickRef.current = onNodeClick;
    });
    useEffect(() => {
      onNodeContextMenuRef.current = onNodeContextMenu;
    });
    useEffect(() => {
      onPositionsChangeRef.current = onPositionsChange;
    });

    const collectPositions = useCallback(
      (cy: Core) =>
        cy.nodes().map((n) => ({
          id: n.id(),
          x: Math.round(n.position().x),
          y: Math.round(n.position().y),
        })),
      []
    );

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

      let cancelled = false;

      (async () => {
        const iconMap = await buildNodeIcons();
        if (cancelled) return;

        const cy = cytoscape({
          container: containerRef.current!,
          elements: {
            nodes: topology.nodes.map((n) => ({
              data: {
                id: n.id,
                label: n.name,
                type: n.type,
                inRack: n.inRack,
                icon: iconMap.get(n.type) ?? '',
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
                shape: 'rectangle',
                'background-opacity': 0,
                'background-image': 'data(icon)',
                'background-fit': 'cover',
                'background-width': '100%',
                'background-height': '100%',
                'border-width': 0,
                width: 56,
                height: 56,
                label: 'data(label)',
                color: '#94a3b8',
                'font-size': 12,
                'text-valign': 'bottom',
                'text-halign': 'center',
                'text-margin-y': 6,
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
                width: 1.5,
                'line-color': '#334155',
                'line-style': 'solid',
                'target-arrow-shape': 'none',
                'curve-style': 'straight',
                opacity: 0.6,
              },
            },
            {
              selector: 'edge:selected',
              style: {
                width: 2.5,
                'line-color': '#6366f1',
                opacity: 1,
              },
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
          const node = e.target as NodeSingular;
          onNodeClickRef.current(node.id());
        });

        // Right-click context menu
        cy.on('cxttap', 'node', (e) => {
          const node = e.target as NodeSingular;
          const native = e.originalEvent;
          onNodeContextMenuRef.current({
            id: node.id(),
            x: native.clientX,
            y: native.clientY,
            type: node.data('type') as DeviceType,
          });
        });

        // Fixed pixel size — scale node inversely with zoom
        const NODE_PX = 56;
        const FONT_PX = 12;
        const applyFixedSize = () => {
          const z = cy.zoom();
          cy.nodes().style({
            width: NODE_PX / z,
            height: NODE_PX / z,
            'font-size': FONT_PX / z,
            'text-margin-y': 6 / z,
          });
        };
        applyFixedSize();

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
      })(); // end async IIFE

      return () => {
        cancelled = true;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [!!topology?.nodes?.length]);

    // Sync topology changes after initialization (add/remove nodes & edges)
    useEffect(() => {
      const cy = cyRef.current;
      if (!cy || !topology) return;

      const existingNodeIds = new Set(cy.nodes().map((n) => n.id()));
      const incomingNodeIds = new Set(topology.nodes.map((n) => n.id));

      (async () => {
        const iconMap = await buildNodeIcons();

        cy.batch(() => {
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
                  icon: iconMap.get(n.type) ?? '',
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
            // Safety check: ensure both source and target exist before adding edge
            if (cy.getElementById(e.source).length > 0 && cy.getElementById(e.target).length > 0) {
              cy.add({
                group: 'edges',
                data: {
                  id: `${e.source}-${e.target}`,
                  source: e.source,
                  target: e.target,
                },
              });
            }
          });
        });
      })();
    }, [topology]);

    return (
      <div ref={containerRef} className="h-full w-full" onContextMenu={(e) => e.preventDefault()} />
    );
  }
);

CytoscapeCanvas.displayName = 'CytoscapeCanvas';

export default CytoscapeCanvas;
