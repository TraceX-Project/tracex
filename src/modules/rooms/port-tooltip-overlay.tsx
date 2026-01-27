import { RackDevice } from './_types/room';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';

type Props = {
  device: RackDevice;
  scale: number;
  imgX: number;
  imgY: number;
};

const PortTooltipOverlay = ({ device, scale, imgX, imgY }: Props) => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <TooltipProvider>
        {device.deviceInterfaces?.map((box, i) => {
          const absX = imgX + box.x * scale;
          const absY = imgY + box.y * scale;
          const absWidth = box.width * scale;
          const absHeight = box.height * scale;

          return (
            <Tooltip key={`tooltip-${i}`}>
              <TooltipTrigger asChild>
                <div
                  className="absolute cursor-pointer pointer-events-auto"
                  style={{
                    left: absX,
                    top: absY,
                    width: absWidth,
                    height: absHeight,
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <div className="font-semibold">{box.name}</div>
                {box.connectedInterface && (
                  <div className="text-slate-300">
                    To: {box.connectedInterface.deviceName}{' '}
                    <span className="text-yellow-400">
                      {box.connectedInterface.name}
                    </span>
                  </div>
                )}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </div>
  );
};

export default PortTooltipOverlay;
