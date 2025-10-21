import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image as KImage, Rect, Transformer } from 'react-konva';
import useImage from 'use-image';
import { PortInput } from './_types/device-template';
import PortTypeConfiguration from './port-range-configuration';
import { Button } from '@/shared/components/ui/button';
import Konva from 'konva';
import { useAppForm } from '@/shared/tanstack-form/form';

type Props = {
  form: ReturnType<typeof useAppForm>;
};

const LabelingForm = ({ form }: Props) => {
  const [ports, setPorts] = useState<PortInput[]>(
    (form.getFieldValue('ports') as PortInput[]) || []
  );
  const [imageURL, setImageURL] = useState(() => {
    const file = form.getFieldValue('frontPanel') as File | undefined;
    return file ? URL.createObjectURL(file) : '';
  });

  const [image] = useImage(imageURL);
  const [stageSize, setStageSize] = useState({ width: 800, height: 200 });
  const rectRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAddBox = () => {
    const newBox: PortInput = {
      x: 100 + ports.length * 25,
      y: 10,
      w: 30,
      h: 30,
    };
    const updated = [...ports, newBox];
    setPorts(updated);
    form.setFieldValue('ports', updated);
  };

  useEffect(() => {
    const updateStageSize = () => {
      const containerWidth = containerRef.current?.offsetWidth ?? 800;
      const maxWidth = Math.min(containerWidth, 1200);
      const aspectRatio = 60 / 750;
      const calculatedHeight = Math.max(100, maxWidth * aspectRatio * 1.5);

      setStageSize({
        width: maxWidth,
        height: Math.min(calculatedHeight, 300),
      });
    };

    updateStageSize();
    window.addEventListener('resize', updateStageSize);
    return () => window.removeEventListener('resize', updateStageSize);
  }, []);

  // Calculate display size
  const displayWidth = Math.min(stageSize.width - 50, 750);
  const displayHeight = Math.min(displayWidth * (60 / 750), stageSize.height - 50);

  const originalWidth = image?.width ?? displayWidth;
  const originalHeight = image?.height ?? displayHeight;

  const scaleX = displayWidth / originalWidth;
  const scaleY = displayHeight / originalHeight;

  useEffect(() => {
    if (rectRef.current) {
      trRef.current?.nodes([rectRef.current]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [image, stageSize]);

  return (
    <div className="space-y-6">
      <div
        ref={containerRef}
        className="w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
      >
        <Stage width={stageSize.width} height={stageSize.height}>
          <Layer>
            <KImage
              image={image}
              width={displayWidth}
              height={displayHeight}
              x={(stageSize.width - displayWidth) / 2}
              y={(stageSize.height - displayHeight) / 2}
            />
            {ports.map((port, index) => (
              <React.Fragment key={index}>
                <Rect
                  ref={rectRef}
                  x={port.x * scaleX + (stageSize.width - displayWidth) / 2}
                  y={port.y * scaleY + (stageSize.height - displayHeight) / 2}
                  width={port.w * scaleX}
                  height={port.h * scaleY}
                  stroke="green"
                  strokeWidth={2}
                  draggable
                />
                <Transformer
                  ref={trRef}
                  rotateEnabled={false}
                  anchorSize={5}
                  anchorStroke="transparent"
                  anchorFill="transparent"
                  boundBoxFunc={(oldBox, newBox) => {
                    if (newBox.width < 20 || newBox.height < 20) return oldBox;
                    return newBox;
                  }}
                />
              </React.Fragment>
            ))}
          </Layer>
        </Stage>
      </div>

      <div className="mt-4 flex gap-4">
        <Button type="button" onClick={handleAddBox}>
          ➕ Add Box
        </Button>
      </div>

      {/* Interface Configuration */}
      <PortTypeConfiguration form={form} />
    </div>
  );
};

export default LabelingForm;
