import type Konva from 'konva';
import { memo } from 'react';
import { Rect, Group, Image, Text } from 'react-konva';

export interface PortBox {
  x: number;
  y: number;
  width: number;
  height: number;
  name?: string;
  portNumber?: number;
  [key: string]: unknown;
}

type Props = {
  box: PortBox;
  scaleX: number;
  scaleY: number;
  imgX?: number;
  imgY?: number;
  strokeWidth?: number;
  portHeaderImage?: HTMLImageElement | undefined;
  draggable?: boolean;
  isSelected?: boolean;
  showLabel?: boolean;
  onClick?: () => void;
  onDragEnd?: (e: Konva.KonvaEventObject<DragEvent>) => void;
  name?: string;
};

const PortItem = memo(
  ({
    box,
    scaleX,
    scaleY,
    imgX = 0,
    imgY = 0,
    strokeWidth = 1,
    portHeaderImage,
    draggable = false,
    isSelected = false,
    showLabel = false,
    onClick,
    onDragEnd,
    name,
  }: Props) => {
    const absX = imgX + box.x * scaleX;
    const absY = imgY + box.y * scaleY;
    const absWidth = box.width * scaleX;
    const absHeight = box.height * scaleY;

    const labelText = box.portNumber?.toString() ?? box.name ?? '';

    return (
      <Group
        x={absX}
        y={absY}
        draggable={draggable}
        name={name}
        onClick={onClick}
        onDragEnd={onDragEnd}
      >
        {portHeaderImage && (
          <Image image={portHeaderImage} width={absWidth} height={absHeight} listening={false} />
        )}

        <Rect
          width={absWidth}
          height={absHeight}
          fill={isSelected ? 'rgba(0, 163, 255, 0.2)' : 'transparent'}
          stroke={isSelected ? '#FF3939' : '#39FF14'}
          strokeWidth={isSelected ? 2 : strokeWidth}
          hitStrokeWidth={10}
        />

        {showLabel && (
          <Text
            text={labelText}
            width={absWidth}
            height={absHeight}
            fontSize={Math.min(
              absHeight * 0.8,
              Math.max(10, absWidth / (labelText.length * 0.7))
            )}
            fill="white"
            align="center"
            verticalAlign="middle"
            fontStyle="bold"
            wrap="none"
            listening={false}
          />
        )}
      </Group>
    );
  }
);

PortItem.displayName = 'PortItem';

export default PortItem;
