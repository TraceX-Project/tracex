'use client';

import { useMemo, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import { type RackDevice } from './_types/room';
import { useResizeObserver } from '@/shared/hooks/use-resize-observer';
import PortItem from '../admin/device-templates/port-item';
import PortTooltipOverlay from './port-tooltip-overlay';

type Props = {
  device: RackDevice;
  fill?: boolean;
};

const DevicePortMap = ({ device, fill = false }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [image, status] = useImage(device.deviceTemplate.frontPanelUrl ?? '');
  const [portHeader] = useImage('/assets/icons/lan-port.png');

  const { width = 0, height = 0 } = useResizeObserver({
    ref: containerRef as React.RefObject<HTMLElement>,
  });

  const { scaleX, scaleY } = useMemo(() => {
    if (!image || width === 0 || height === 0) {
      return { scaleX: 1, scaleY: 1 };
    }

    const scaleX = width / image.width;
    const scaleY = height / image.height;

    if (fill) {
      return { scaleX, scaleY };
    }

    const minScale = Math.min(scaleX, scaleY);
    return { scaleX: minScale, scaleY: minScale };
  }, [image, width, height, fill]);

  const imgWidth = image ? image.width * scaleX : 0;
  const imgHeight = image ? image.height * scaleY : 0;
  const imgX = (width - imgWidth) / 2;
  const imgY = (height - imgHeight) / 2;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
    >
      {width > 0 && height > 0 && (
        <>
          {status === 'failed' && (
            <div className="absolute inset-0 flex items-center justify-center text-red-500 font-medium">
              Image failed to load
            </div>
          )}
          <Stage width={width} height={height} className="absolute top-0 left-0">
            <Layer>
              {image && (
                <KonvaImage
                  image={image}
                  scaleX={scaleX}
                  scaleY={scaleY}
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
                    scaleX={scaleX}
                    scaleY={scaleY}
                    imgX={imgX}
                    imgY={imgY}
                    strokeWidth={1}
                    portHeaderImage={portHeader}
                  />
                ))}
            </Layer>
          </Stage>

          <PortTooltipOverlay device={device} scale={scaleX} imgX={imgX} imgY={imgY} />
        </>
      )}
    </div>
  );
};

export default DevicePortMap;