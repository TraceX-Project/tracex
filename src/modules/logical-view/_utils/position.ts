import { DEFAULT_NODE_HEIGHT, DEFAULT_NODE_WIDTH } from '../_constants/logical-view';
import dagre from '@dagrejs/dagre';

const TIER: Record<string, number> = {
  router:          0,
  switch:          1,
  switch_stack:    1,
  server:          2,
  virtual_switch:  3,
  virtual_machine: 4,
};

const getTier = (type: string): number => TIER[type] ?? 2;

export const getLayoutedPositions = (
  nodes: { id: string; type?: string }[],
  edges: { source: string; target: string }[]
): Map<string, { x: number; y: number }> => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: 'LR',
    nodesep: 60,
    ranksep: 80,
    ranker: 'network-simplex',
  });
  g.setDefaultEdgeLabel(() => ({}));

  const nodeTypeMap = new Map(nodes.map((n) => [n.id, n.type ?? '']));
  const connectedIds = new Set(edges.flatMap((e) => [e.source, e.target]));
  const isolatedNodes = nodes.filter((n) => !connectedIds.has(n.id));

  nodes.forEach((node) => {
    if (connectedIds.has(node.id)) {
      g.setNode(node.id, { width: DEFAULT_NODE_WIDTH, height: DEFAULT_NODE_HEIGHT });
    }
  });

  edges.forEach((edge) => {
    const s = getTier(nodeTypeMap.get(edge.source) ?? '');
    const t = getTier(nodeTypeMap.get(edge.target) ?? '');

    // Same tier = peer connection — skip to avoid same-rank edge routing crash in dagre
    if (s === t) return;

    // Always feed dagre edges that flow top → bottom regardless of raw data direction
    g.setEdge(s < t ? edge.source : edge.target, s < t ? edge.target : edge.source);
  });

  dagre.layout(g);

  const positions = new Map<string, { x: number; y: number }>();
  let graphRight = -Infinity;
  let graphTop = Infinity;

  g.nodes().forEach((nodeId) => {
    const node = g.node(nodeId);
    const x = node.x - DEFAULT_NODE_WIDTH / 2;
    const y = node.y - DEFAULT_NODE_HEIGHT / 2;
    positions.set(nodeId, { x, y });
    graphRight = Math.max(graphRight, x + DEFAULT_NODE_WIDTH);
    graphTop   = Math.min(graphTop, y);
  });

  // Place isolated nodes to the right — in TB layout this zone is guaranteed edge-free
  const PADDING = 60;
  const STEP_X  = DEFAULT_NODE_WIDTH  + PADDING;
  const STEP_Y  = DEFAULT_NODE_HEIGHT + PADDING;
  const colCount = Math.max(1, Math.ceil(Math.sqrt(isolatedNodes.length)));
  const originX  = (positions.size > 0 ? graphRight : 0) + PADDING;
  const originY  = graphTop === Infinity ? 0 : graphTop;

  isolatedNodes.forEach((node, i) => {
    positions.set(node.id, {
      x: originX + (i % colCount) * STEP_X,
      y: originY + Math.floor(i / colCount) * STEP_Y,
    });
  });

  return positions;
};

// Given two node positions (top-left corner), return which handles to use
// so the edge exits/enters from the most natural side.
export const getEdgeHandles = (
  source: { x: number; y: number },
  target: { x: number; y: number }
): { sourceHandle: string; targetHandle: string } => {
  const dx = target.x - source.x;
  const dy = target.y - source.y;

  if (Math.abs(dy) >= Math.abs(dx)) {
    return dy > 0
      ? { sourceHandle: 'bottom', targetHandle: 'top' }
      : { sourceHandle: 'top', targetHandle: 'bottom' };
  } else {
    return dx > 0
      ? { sourceHandle: 'right', targetHandle: 'left' }
      : { sourceHandle: 'left', targetHandle: 'right' };
  }
};
