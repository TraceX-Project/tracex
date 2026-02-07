import { type Node, type Edge } from '../_types/logical-view';
import { DEFAULT_NODE_HEIGHT, DEFAULT_NODE_WIDTH } from '../_constants/logical-view';
import dagre from '@dagrejs/dagre';

export const getLayoutedPositions = (nodes: Node[], edges: Edge[]) => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'LR' });
  g.setDefaultEdgeLabel(() => ({}));


  nodes.forEach((node) => {
    g.setNode(node.id, { width: DEFAULT_NODE_WIDTH, height: DEFAULT_NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const positions = new Map<string, { x: number; y: number }>();
  g.nodes().forEach((nodeId) => {
    const node = g.node(nodeId);
    positions.set(nodeId, { x: node.x, y: node.y });
  });

  return positions;
};
