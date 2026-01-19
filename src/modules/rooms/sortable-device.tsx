'use client';
import { useSortable } from '@dnd-kit/sortable';
import React, { useEffect } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/shared/lib/cn';
import { Dialog } from '@radix-ui/react-dialog';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import PortCanvas from './port-canvas';
import { useStageSize } from '../admin/device-templates/_hooks/use-stage-size';
import { useImageFitToStage } from './_hooks/use-image-fit-to-stage';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import PortBoxItem from './port-box-item';
import { Device } from './_types/room';

type Props = {
  device: Device;
};

const SortableDevice = ({ device }: Props) => {
  const deviceInterfaces = [
    {
      id: '9fa04aea-fa50-4c1d-a9de-7e56e58b8087',
      name: 'GigabitEthernet1/0/1',
      x: 52,
      y: 18,
      width: 17,
      height: 15,
      status: 'connected',
    },
    {
      id: 'e2e03dc5-3242-4454-b952-d10c959a6692',
      name: 'GigabitEthernet1/0/3',
      x: 74,
      y: 18,
      width: 18,
      height: 15,
      status: 'connected',
    },
    {
      id: '9cd3e2d5-a260-44f6-af7f-a68f94680675',
      name: 'GigabitEthernet1/0/5',
      x: 97,
      y: 18,
      width: 17,
      height: 15,
      status: 'connected',
    },
    {
      id: 'd3bd3d5c-3123-4026-a30c-d1877b954a74',
      name: 'GigabitEthernet1/0/6',
      x: 97,
      y: 41,
      width: 17,
      height: 15,
      status: 'connected',
    },
    {
      id: '407b72e4-4ad2-4731-994e-0a7e7d82083f',
      name: 'GigabitEthernet1/0/7',
      x: 119,
      y: 18,
      width: 17,
      height: 15,
      status: 'connected',
    },
  ];
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: device.id,
  });
  const { containerRef, stageSize } = useStageSize();
  const { containerRef: modalRef, stageSize: modalStageSize } = useStageSize({
    padding: 0,
  });

  const { image, x, y, width, height, scaleX, scaleY } = useImageFitToStage(
    device.deviceTemplate.frontPanelUrl,
    stageSize,
    16,
    false
  );

  const {
    image: imageModal,
    x: xModal,
    y: yModal,
    width: widthModal,
    height: heightModal,
    scaleX: scaleXModal,
    scaleY: scaleYModal,
  } = useImageFitToStage(device.deviceTemplate.frontPanelUrl, modalStageSize, 0, true);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  useEffect(() => {
    console.log('device', device);
    console.log(modalStageSize, widthModal, heightModal);
  }, [device, modalStageSize]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'flex w-full cursor-grab flex-col active:cursor-grabbing',
        isDragging && 'z-50 shadow-lg'
      )}
    >
      <Dialog>
        <DialogTrigger asChild>
          <div
            ref={modalRef}
            className="relative w-full select-none"
            style={{
              aspectRatio: imageModal ? `${imageModal.width} / ${imageModal.height}` : '300 / 44',
            }}
          >
            <Stage
              width={modalStageSize.width}
              height={modalStageSize.height}
              className="absolute top-0 left-0"
            >
              <Layer>
                <KonvaImage
                  image={imageModal}
                  x={xModal}
                  y={yModal}
                  width={widthModal}
                  height={heightModal}
                />

                {deviceInterfaces.map((box, index) => (
                  <PortBoxItem
                    key={index}
                    box={box}
                    x={xModal}
                    y={yModal}
                    scaleX={scaleXModal}
                    scaleY={scaleYModal}
                  />
                ))}
              </Layer>
            </Stage>
          </div>
        </DialogTrigger>
        <DialogContent className="min-w-4xl">
          <DialogHeader>
            <DialogTitle>Device Detail</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <PortCanvas
              image={image}
              x={x}
              y={y}
              width={width}
              height={height}
              scaleX={scaleX}
              scaleY={scaleY}
              containerRef={containerRef}
              stageSize={stageSize}
              boxes={deviceInterfaces}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SortableDevice;
