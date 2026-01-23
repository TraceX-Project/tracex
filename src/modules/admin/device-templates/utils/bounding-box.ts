import { Alignment, type BoundingBox } from '../_types/device-template';

export const reindexBoxes = (
  boxes: BoundingBox[],
  alignment: Alignment,
  tolerance = 10
): BoundingBox[] => {
  const sorted = [...boxes].sort((a, b) => {
    if (alignment === Alignment.HORIZONTAL) {
      const yDiff = Math.abs(a.y - b.y);
      if (yDiff > tolerance) return a.y - b.y;
      return a.x - b.x;
    } else {
      const xDiff = Math.abs(a.x - b.x);
      if (xDiff > tolerance) return a.x - b.x;
      return a.y - b.y;
    }
  });

  return sorted.map((box, i) => ({
    ...box,
    portNumber: i + 1,
  }));
};
