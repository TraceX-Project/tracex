import { Group, Image, Label, Tag, Text } from 'react-konva';
import type Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { type BoundingBox } from '@/modules/rooms/_types/room';
import useImage from 'use-image';

type Props = {
  box: BoundingBox;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
};

const PortBoxItem = ({ box, x, y, scaleX, scaleY }: Props) => {
  const groupRef = useRef<Konva.Group>(null);
  const rectRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const textRef = useRef<Konva.Text>(null);

  const posX = box.x * scaleX + x;
  const posY = box.y * scaleY + y;

  useEffect(() => {
    if (!rectRef.current || !textRef.current) return;

    const rect = rectRef.current;
    const text = textRef.current;

    text.width(rect.width());
    text.height(rect.height());

    text.x(rect.x());
    text.y(rect.y());
  }, [box.width, box.height, posX, posY]);

  const [image] = useImage('/assets/icons/gRealCopperST_HeadDown.png');
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Group
        ref={groupRef}
        x={posX}
        y={posY}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          image={image}
          width={box.width * scaleX}
          height={box.height * scaleY}
          ref={rectRef} // Keeping the ref name even though it's an Image now to avoid breaking other logic if generic
        />
        {isHovered && (
          <Label y={-30}>
            <Tag fill="black" opacity={0.8} pointerEvents="none" cornerRadius={4} />
            <Text text={box.name} padding={5} fill="white" fontSize={12} align="center" />
          </Label>
        )}
      </Group>
  );
};

export default PortBoxItem;
