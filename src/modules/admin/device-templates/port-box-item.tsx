import { Group, Rect, Text, Transformer } from 'react-konva';
import type Konva from 'konva';
import { useEffect, useRef } from 'react';
import { usePortBoundingBoxStore } from './_store/port-boundingbox';
import { type BoundingBox } from './_types/device-template';

type Props = {
  box: BoundingBox;
  index: number;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  onSelect: (index: number) => void;
};

const PortBoxItem = ({ box, index, x, y, scaleX, scaleY, onSelect }: Props) => {
  const { updateBox } = usePortBoundingBoxStore((s) => s.actions);
  const selectedBoxId = usePortBoundingBoxStore((s) => s.selectedBoxId);

  const groupRef = useRef<Konva.Group>(null);
  const rectRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const textRef = useRef<Konva.Text>(null);

  const posX = box.x * scaleX + x;
  const posY = box.y * scaleY + y;

  const handleDragEnd = () => {
    if (!groupRef.current) return;

    const g = groupRef.current;
    const abs = g.getAbsolutePosition();

    updateBox(index, {
      x: (abs.x - x) / scaleX,
      y: (abs.y - y) / scaleY,
    });
  };

  const handleTransformEnd = () => {
    if (!rectRef.current || !groupRef.current) return;

    const rect = rectRef.current;
    const g = groupRef.current;

    const currentScaleX = rect.scaleX();
    const currentScaleY = rect.scaleY();

    rect.scaleX(1);
    rect.scaleY(1);

    const newWidth = (rect.width() * currentScaleX) / scaleX;
    const newHeight = (rect.height() * currentScaleY) / scaleY;

    const shiftX = g.x() - posX;
    const shiftY = g.y() - posY;

    updateBox(index, {
      x: box.x + shiftX / scaleX,
      y: box.y + shiftY / scaleY,
      width: newWidth,
      height: newHeight,
    });
  };

  useEffect(() => {
    if (!rectRef.current || !textRef.current) return;

    const rect = rectRef.current;
    const text = textRef.current;

    text.width(rect.width());
    text.height(rect.height());

    text.x(rect.x());
    text.y(rect.y());
  }, [box.width, box.height, posX, posY]);

  useEffect(() => {
    if (!trRef.current || !groupRef.current) return;
    if (selectedBoxId === index) {
      trRef.current.nodes([rectRef.current!]);
    } else {
      trRef.current.nodes([]);
    }
  }, [selectedBoxId]);

  return (
    <>
      <Group
        ref={groupRef}
        x={posX}
        y={posY}
        draggable
        onDragEnd={handleDragEnd}
        onClick={(e) => {
          onSelect(index);

          e.cancelBubble = true;
        }}
      >
        <Rect
          ref={rectRef}
          width={box.width * scaleX}
          height={box.height * scaleY}
          stroke={selectedBoxId === index ? '#FF3939' : '#39FF14'}
          strokeWidth={1}
          fill="transparent"
        />

        <Text
          ref={textRef}
          text={String(box.portNumber)}
          align="center"
          verticalAlign="middle"
          fill="white"
          fontSize={12 * scaleX}
          fontStyle="bold"
          listening={false}
        />
      </Group>

      <Transformer
        ref={trRef}
        rotateEnabled={false}
        keepRatio={false}
        anchorSize={8}
        borderStroke="red"
        onTransformEnd={handleTransformEnd}
      />
    </>
  );
};

export default PortBoxItem;
