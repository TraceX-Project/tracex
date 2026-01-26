import { type Topology, type Node, type Edge } from '../_types/logical-view';

export const mapDevicesToReactFlow = (devices: Topology) => {
  const nodes = devices?.nodes?.map((node: Node) => ({
    id: node.id,
    position: node?.position ?? { x: 0, y: 0 },
    data: { label: node.name, inRack: node.inRack },
    type: node.type,
  }));

  const edges = devices?.edges?.map((edge: Edge) => ({
    id: `${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
  }));

  return { nodes, edges };
};
