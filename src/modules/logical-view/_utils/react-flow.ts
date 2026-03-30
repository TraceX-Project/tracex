import { type Topology, type Node, type Edge } from '../_types/logical-view';


export const mapDevicesToReactFlow = (devices: Topology) => {
  const nodes = devices?.nodes?.map((node: Node) => ({
    id: node.id,
    position: node?.position,
    data: { label: node.name, inRack: node.inRack },
    type: node.type,
  }));

  const sourceIds = [...new Set(devices?.edges?.map((e: Edge) => e.source) ?? [])];

  const edges = devices?.edges?.map((edge: Edge) => {
    return {
      id: `${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      type: 'smoothstep',
      animated: true,
      style: { strokeWidth: 2 },
    };
  });

  return { nodes, edges };
};
