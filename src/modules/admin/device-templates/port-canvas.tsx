import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import { usePortBoundingBoxStore } from './_store/port-boundingbox';
import PortBoxItem from './port-box-item';

type Props = {
  image: HTMLImageElement | undefined;
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  stageSize: { width: number; height: number };
};

const PortCanvas = ({
  image,
  x,
  y,
  width,
  height,
  scaleX,
  scaleY,
  containerRef,
  stageSize,
}: Props) => {
  const boxes = usePortBoundingBoxStore((state) => state.boxes);
  const { selectBox } = usePortBoundingBoxStore((state) => state.actions);

  const handleSelectBox = (id: number) => {
    selectBox(id);
  };

  const handleStageClick = () => {
    selectBox(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-[200px] w-full overflow-hidden rounded-lg border bg-gray-50 select-none"
    >
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        onClick={handleStageClick}
      >
        <Layer>
          <KonvaImage image={image} x={x} y={y} width={width} height={height} />

          {boxes.map((box, index) => (
            <PortBoxItem
              key={index}
              box={box}
              index={index}
              x={x}
              y={y}
              scaleX={scaleX}
              scaleY={scaleY}
              onSelect={handleSelectBox}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default PortCanvas;
