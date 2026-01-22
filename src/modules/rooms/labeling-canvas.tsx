import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text,
  Label,
  Tag,
  Rect,
} from 'react-konva';
import { useRef, useMemo, useState } from 'react';
import { useResizeObserver } from '@/shared/hooks/use-resize-observer';
import useImage from 'use-image';
import { type DevicePort } from '@/modules/rooms/_types/room';
import PortItem, { type TooltipData } from './port-box-item';

type Props = {
  image: HTMLImageElement | undefined;
  boxes: DevicePort[];
};

const LabelingCanvas = ({ image, boxes }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [portHeader] = useImage('/assets/icons/gRealCopperST_HeadDown.png');

  const [tooltipData, setTooltipData] = useState<TooltipData>(null);

  const { width = 0, height = 0 } = useResizeObserver({
    ref: containerRef as React.RefObject<HTMLElement>,
  });

  const scale = useMemo(() => {
    if (!image || width === 0 || height === 0) return 1;
    const scaleWidth = width / image.width;
    const scaleHeight = height / image.height;
    return Math.min(scaleWidth, scaleHeight);
  }, [image, width, height]);

  // Image Positioning
  const imgWidth = image ? image.width * scale : 0;
  const imgHeight = image ? image.height * scale : 0;
  const imgX = (width - imgWidth) / 2;
  const imgY = (height - imgHeight) / 2;

  const tooltipNode = useMemo(() => {
    if (!tooltipData) return null;
    const isTopTight = tooltipData.y < 40;
    const tipX = tooltipData.x + tooltipData.width / 2;
    const tipY = isTopTight ? tooltipData.y + tooltipData.height + 25 : tooltipData.y - 25;

    return (
      <Label x={tipX} y={tipY} listening={false}>
        <Tag
          fill="#1e293b" // Slate-800
          opacity={0.9}
          pointerEvents="none"
          cornerRadius={4}
          shadowColor="black"
          shadowBlur={5}
          shadowOpacity={0.3}
          shadowOffset={{ x: 2, y: 2 }}
        />
        <Text
          text={tooltipData.text}
          fontFamily="Arial"
          fontSize={12}
          padding={8}
          fill="white"
          align="center"
        />
      </Label>
    );
  }, [tooltipData]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[250px] w-full overflow-hidden rounded-md border bg-slate-100 shadow-inner"
    >
      {width > 0 && height > 0 && (
        <Stage width={width} height={height} className="absolute inset-0">
          <Layer>
            {image && (
              <KonvaImage
                image={image}
                scaleX={scale}
                scaleY={scale}
                x={imgX}
                y={imgY}
                listening={false}
              />
            )}

            {image &&
              boxes?.map((box, i) => (
                <PortItem
                  key={`box-${i}`}
                  box={box}
                  scale={scale}
                  imgX={imgX}
                  imgY={imgY}
                  strokeWidth={2}
                  portHeaderImage={portHeader}
                  onHover={setTooltipData}
                />
              ))}
            {tooltipNode}
            {tooltipData && (
              <Rect
                x={tooltipData.x}
                y={tooltipData.y}
                width={tooltipData.width}
                height={tooltipData.height}
                fill="#39FF14"
                opacity={0.2}
                listening={false}
              />
            )}
          </Layer>
        </Stage>
      )}
    </div>
  );
};

export default LabelingCanvas;
