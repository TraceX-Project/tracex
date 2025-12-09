import { Alignment, type BoundingBox } from '../_types/device-template';

export const reindexBoundingBoxes = (
  boxes: BoundingBox[],
  mode: Alignment,
  scaleY = 1,
  scaleX = 1
) => {
  if (boxes.length === 0) return [];

  const isHorizontal = mode === Alignment.HORIZONTAL;
  const threshold = isHorizontal ? 15 / scaleY : 15 / scaleX;

  const indexMap = new Map<BoundingBox, number>();
  boxes.forEach((box, i) => indexMap.set(box, i));

  const horizontalSort = (a: BoundingBox, b: BoundingBox) => {
    const yDiff = Math.abs(a.y - b.y);

    // Same row → sort by X
    if (yDiff < threshold) return a.x - b.x;

    // Different rows → sort by Y
    return a.y - b.y;
  };

  const verticalSort = (a: BoundingBox, b: BoundingBox) => {
    const xDiff = Math.abs(a.x - b.x);

    // Same column → sort by Y
    if (xDiff < threshold) return a.y - b.y;

    // Different columns → sort by X
    return a.x - b.x;
  };

  const comparator = isHorizontal ? horizontalSort : verticalSort;

  const sorted = [...boxes].sort(comparator);

  const portNumberMap = new Map<number, number>();

  sorted.forEach((box, idx) => {
    const originalIndex = indexMap.get(box);
    if (originalIndex !== undefined) {
      portNumberMap.set(originalIndex, idx + 1);
    }
  });

  return boxes.map((box, index) => ({
    ...box,
    portNumber: portNumberMap.get(index) ?? index + 1,
  }));
};
