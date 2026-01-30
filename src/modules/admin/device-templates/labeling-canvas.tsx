import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import { type BoundingBox } from './_types/device-template';
import { forwardRef, useRef, useEffect, useCallback } from 'react';
import type Konva from 'konva';
import PortItem from '@/modules/admin/device-templates/port-item';

type Props = {
  width: number;
  height: number;
  image: HTMLImageElement | undefined;
  scale: number;
  boxes: BoundingBox[];
  selectedIndex: number | null;
  onSelect: (index: number | null) => void;
  onChange: (index: number, newBox: BoundingBox) => void;
};

const LabelingCanvas = forwardRef<HTMLDivElement, Props>(
  ({ width, height, image, scale, boxes, selectedIndex, onSelect, onChange }, ref) => {
    const trRef = useRef<Konva.Transformer>(null);

    useEffect(() => {
      if (selectedIndex !== null && trRef.current) {
        const stage = trRef.current.getStage();
        const selectedNode = stage?.findOne('.box-' + selectedIndex);
        if (selectedNode) {
          trRef.current.nodes([selectedNode]);
          trRef.current.getLayer()?.batchDraw();
        }
      } else if (trRef.current) {
        trRef.current.nodes([]);
        trRef.current.getLayer()?.batchDraw();
      }
    }, [selectedIndex, boxes]);

    const handleStageMouseDown = useCallback(
      (e: Konva.KonvaEventObject<MouseEvent>) => {
        const clickedOnEmpty = e.target === e.target.getStage();
        const isTransformer = e.target.getParent()?.className === 'Transformer';
        const isBox =
          e.target.name()?.startsWith('box-') || e.target.getParent()?.name()?.startsWith('box-');

        if (clickedOnEmpty || (!isTransformer && !isBox)) {
          onSelect(null);
          trRef.current?.nodes([]);
        }
      },
      [onSelect]
    );

    const handleDragEnd = useCallback(
      (e: Konva.KonvaEventObject<DragEvent>, index: number, box: BoundingBox) => {
        if (!image) return;
        const node = e.target;
        const imageOffsetX = (width - image.width * scale) / 2;
        const imageOffsetY = (height - image.height * scale) / 2;

        const newX = (node.x() - imageOffsetX) / scale;
        const newY = (node.y() - imageOffsetY) / scale;

        onChange(index, {
          ...box,
          x: newX,
          y: newY,
        });
      },
      [image, width, height, scale, onChange]
    );

    const handleTransformEnd = useCallback(
      (e: Konva.KonvaEventObject<Event>) => {
        if (!image || selectedIndex === null) return;

        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        node.scaleX(1);
        node.scaleY(1);

        const imageOffsetX = (width - image.width * scale) / 2;
        const imageOffsetY = (height - image.height * scale) / 2;

        const newX = (node.x() - imageOffsetX) / scale;
        const newY = (node.y() - imageOffsetY) / scale;

        const currentBox = boxes[selectedIndex];
        onChange(selectedIndex, {
          ...currentBox,
          x: newX,
          y: newY,
          width: currentBox.width * scaleX,
          height: currentBox.height * scaleY,
        });
      },
      [image, selectedIndex, width, height, scale, boxes, onChange]
    );

    return (
      <div
        className="relative min-h-[200px] w-full overflow-hidden rounded-md border bg-slate-100"
        ref={ref}
      >
        <Stage
          width={width}
          height={height}
          className="absolute inset-0"
          onMouseDown={handleStageMouseDown}
        >
          <Layer>
            {image && (
              <KonvaImage
                image={image}
                scaleX={scale}
                scaleY={scale}
                x={(width - image.width * scale) / 2}
                y={(height - image.height * scale) / 2}
              />
            )}
            {image &&
              boxes?.map((box, i) => (
                <PortItem
                  key={i}
                  box={box}
                  scale={scale}
                  imgX={(width - image.width * scale) / 2}
                  imgY={(height - image.height * scale) / 2}
                  isSelected={selectedIndex === i}
                  draggable
                  name={`box-${i}`}
                  onDragEnd={(e) => handleDragEnd(e, i, box)}
                  onClick={() => onSelect(i)}
                  showLabel
                />
              ))}
            <Transformer
              ref={trRef}
              rotateEnabled={false}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
              onTransformEnd={handleTransformEnd}
            />
          </Layer>
        </Stage>
      </div>
    );
  }
);

LabelingCanvas.displayName = 'LabelingCanvas';

export default LabelingCanvas;
