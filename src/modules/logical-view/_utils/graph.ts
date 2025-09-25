import dagre from '@dagrejs/dagre';
import { type Node, type Edge } from '@xyflow/react';
import { DEFAULT_NODE_HEIGHT, DEFAULT_NODE_WIDTH } from '../_constants/logical-view';

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

export const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  // const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes?.forEach((node) => {
    dagreGraph.setNode(node.id, { width: DEFAULT_NODE_WIDTH, height: DEFAULT_NODE_HEIGHT });
  });

  edges?.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes?.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      // targetPosition: isHorizontal ? 'left' : 'top',
      // sourcePosition: isHorizontal ? 'right' : 'bottom',

      position: {
        x: nodeWithPosition.x - DEFAULT_NODE_WIDTH / 2,
        y: nodeWithPosition.y - DEFAULT_NODE_HEIGHT / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};
