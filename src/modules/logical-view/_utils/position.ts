import { DEFAULT_NODE_HEIGHT, DEFAULT_NODE_WIDTH } from '../_constants/logical-view';

const TIER: Record<string, number> = {
  router: 0,
  switch: 1,
  switch_stack: 1,
  server: 2,
  virtual_switch: 3,
  virtual_machine: 4,
};

const X_GAP = 80;
const Y_GAP = 120;

const getTier = (type?: string): number => TIER[type ?? ''] ?? 2;

export const getLayoutedPositions = (
  nodes: { id: string; type?: string }[],
  edges: { source: string; target: string }[]
): Map<string, { x: number; y: number }> => {
  if (!nodes?.length) return new Map();

  const typeMap = new Map(nodes.map((n) => [n.id, n.type ?? '']));

  // Build cross-tier child map (higher tier → lower tier only)
  const childrenMap = new Map<string, string[]>(nodes.map((n) => [n.id, []]));
  const hasParent = new Set<string>();

  edges.forEach((e) => {
    const st = getTier(typeMap.get(e.source));
    const tt = getTier(typeMap.get(e.target));
    if (st < tt) {
      childrenMap.get(e.source)!.push(e.target);
      hasParent.add(e.target);
    } else if (tt < st) {
      childrenMap.get(e.target)!.push(e.source);
      hasParent.add(e.source);
    }
    // same-tier (peer) edges: skip — they don't affect placement
  });

  // Compute minimum subtree width needed for each node (Reingold-Tilford)
  const widthCache = new Map<string, number>();
  const computing = new Set<string>();

  const subtreeWidth = (id: string): number => {
    if (widthCache.has(id)) return widthCache.get(id)!;
    if (computing.has(id)) return DEFAULT_NODE_WIDTH; // cycle guard
    computing.add(id);

    const children = childrenMap.get(id) ?? [];
    let w = DEFAULT_NODE_WIDTH;
    if (children.length) {
      const childrenTotalW =
        children.reduce((sum, cid) => sum + subtreeWidth(cid), 0) +
        (children.length - 1) * X_GAP;
      w = Math.max(w, childrenTotalW);
    }

    computing.delete(id);
    widthCache.set(id, w);
    return w;
  };

  nodes.forEach((n) => subtreeWidth(n.id));

  const positions = new Map<string, { x: number; y: number }>();
  const placed = new Set<string>();

  const place = (id: string, centerX: number, y: number) => {
    if (placed.has(id)) return;
    placed.add(id);
    positions.set(id, { x: centerX - DEFAULT_NODE_WIDTH / 2, y });

    const children = childrenMap.get(id) ?? [];
    if (!children.length) return;

    const childY = y + DEFAULT_NODE_HEIGHT + Y_GAP;
    const totalW =
      children.reduce((sum, cid) => sum + subtreeWidth(cid), 0) +
      (children.length - 1) * X_GAP;

    let cx = centerX - totalW / 2;
    children.forEach((cid) => {
      const cw = subtreeWidth(cid);
      place(cid, cx + cw / 2, childY);
      cx += cw + X_GAP;
    });
  };

  // Place roots (nodes with no cross-tier parent) across the top row
  const roots = nodes.filter((n) => !hasParent.has(n.id));
  const totalRootW =
    roots.reduce((sum, r) => sum + subtreeWidth(r.id), 0) +
    (roots.length - 1) * X_GAP;

  let rootCX = -totalRootW / 2;
  roots.forEach((r) => {
    const rw = subtreeWidth(r.id);
    place(r.id, rootCX + rw / 2, 0);
    rootCX += rw + X_GAP;
  });

  // Nodes unreachable from roots (isolated / in cycles) — place in a row below
  const unplaced = nodes.filter((n) => !placed.has(n.id));
  if (unplaced.length) {
    const maxY = Math.max(...[...positions.values()].map((p) => p.y), 0);
    const startX =
      -(unplaced.length * (DEFAULT_NODE_WIDTH + X_GAP) - X_GAP) / 2;
    unplaced.forEach((n, i) => {
      positions.set(n.id, {
        x: startX + i * (DEFAULT_NODE_WIDTH + X_GAP),
        y: maxY + DEFAULT_NODE_HEIGHT + Y_GAP,
      });
    });
  }

  return positions;
};

// Return which handles give the most natural edge routing between two nodes
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
  }
  return dx > 0
    ? { sourceHandle: 'right', targetHandle: 'left' }
    : { sourceHandle: 'left', targetHandle: 'right' };
};
