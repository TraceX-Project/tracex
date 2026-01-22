import { memo } from 'react';
import { Rect, Group, Image } from 'react-konva';
import { type DevicePort } from './_types/room';

export type TooltipData = {
  x: number;
  y: number;
  strokeWidth: number;
  width: number;
  height: number;
  text: string;
} | null;

const PortItem = memo(
  ({
    box,
    scale,
    imgX,
    imgY,
    strokeWidth,
    portHeaderImage,
    onHover,
  }: {
    box: DevicePort;
    scale: number;
    imgX: number;
    imgY: number;
    strokeWidth: number;
    portHeaderImage: HTMLImageElement | undefined;
    onHover?: (data: TooltipData) => void;
  }) => {
    const absX = imgX + box.x * scale;
    const absY = imgY + box.y * scale;
    const absWidth = box.width * scale ;
    const absHeight = box.height * scale ;
    // const strokeWidth = Math.max(1, 2 / scale);

    return (
      <Group
        x={absX}
        y={absY}
        onMouseEnter={() => {
          onHover?.({
            x: absX,
            y: absY,
            width: absWidth,
            height: absHeight,
            strokeWidth,
            text: box.name,
          });
        }}
        onMouseLeave={() => {
          onHover?.(null);
        }}
      >
        <Image image={portHeaderImage} width={absWidth} height={absHeight} listening={false} />

        <Rect
          width={absWidth}
          height={absHeight}
          fill="transparent"
          stroke="#39FF14"
          strokeWidth={strokeWidth}
          hitStrokeWidth={10}
        />
      </Group>
    );
  }
);

PortItem.displayName = 'PortItem';

export default PortItem;
