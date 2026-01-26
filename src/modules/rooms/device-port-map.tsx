'use client';

import { useMemo, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import { RackDevice } from './_types/room';
import { useResizeObserver } from '@/shared/hooks/use-resize-observer';
import PortItem from './port-box-item';

type Props = {
  device: RackDevice;
};

const DevicePortMap = ({ device }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [image] = useImage(device.deviceTemplate.frontPanelUrl ?? '', 'anonymous');
  const [portHeader] = useImage('/assets/icons/lan-port.png', 'anonymous');

  const { width = 0, height = 0 } = useResizeObserver({
    ref: containerRef as React.RefObject<HTMLElement>,
  });

  const scale = useMemo(() => {
    if (!image || width === 0 || height === 0) {
      return 1;
    }

    const items = [width / image.width, height / image.height];

    return Math.min(...items);
  }, [image, width, height]);

  const imgWidth = image ? image.width * scale : 0;
  const imgHeight = image ? image.height * scale : 0;
  const imgX = (width - imgWidth) / 2;
  const imgY = (height - imgHeight) / 2;

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{
        aspectRatio: image ? `${image.width} / ${image.height}` : '300 / 44',
      }}
    >
      {width > 0 && height > 0 && (
        <Stage width={width} height={height} className="absolute top-0 left-0">
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
              device.deviceInterfaces?.map((box, i) => (
                <PortItem
                  key={`box-${i}`}
                  box={box}
                  scale={scale}
                  imgX={imgX}
                  imgY={imgY}
                  strokeWidth={0.5}
                  portHeaderImage={portHeader}
                />
              ))}
          </Layer>
        </Stage>
      )}
    </div>
  );
};

export default DevicePortMap;