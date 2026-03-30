import { type Topology, type Node, type Edge } from '../_types/logical-view';

const EDGE_COLORS = [
  '#6366f1',
  '#f59e0b',
  '#10b981',
  '#ef4444',
  '#3b82f6',
  '#8b5cf6',
  '#f97316',
  '#14b8a6',
  '#ec4899',
  '#84cc16',
];

export const mapDevicesToReactFlow = (devices: Topology) => {
  const nodes = devices?.nodes?.map((node: Node) => ({
    id: node.id,
    position: node?.position,
    data: { label: node.name, inRack: node.inRack },
    type: node.type,
  }));

  const sourceIds = [...new Set(devices?.edges?.map((e: Edge) => e.source) ?? [])];
  const sourceColorMap = new Map(
    sourceIds.map((id, i) => [id, EDGE_COLORS[i % EDGE_COLORS.length]])
  );

  const edges = devices?.edges?.map((edge: Edge) => {
    const color = sourceColorMap.get(edge.source) ?? EDGE_COLORS[0];
    return {
      id: `${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      type: 'smoothstep',
      animated: true,
      style: { stroke: color, strokeWidth: 2 },
      markerEnd: { type: 'arrowclosed' as const, color },
    };
  });

  return { nodes, edges };
};
