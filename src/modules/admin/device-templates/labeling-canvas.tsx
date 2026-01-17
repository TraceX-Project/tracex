
import { Stage, Layer, Image as KonvaImage, Rect } from 'react-konva';
import { BoundingBox } from './_types/device-template';
import { forwardRef } from 'react';

type Props = {
  width: number
  height: number
  image: HTMLImageElement | undefined
  scale: number
  boxes: BoundingBox[]
}

export const LabelingCanvas = forwardRef<HTMLDivElement, Props>(({ width, height, image, scale, boxes }, ref) => {
  return (
    <div className="relative min-h-[200px] w-full border rounded-md overflow-hidden bg-slate-100" ref={ref}>
      <Stage width={width} height={height} className="absolute inset-0">
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
          {image && boxes?.map((box, i) => (
            <Rect
              key={i}
              x={((width - image.width * scale) / 2) + (box.x * scale)}
              y={((height - image.height * scale) / 2) + (box.y * scale)}
              width={box.width * scale}
              height={box.height * scale}
              stroke="red"
              strokeWidth={2}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  )
})

LabelingCanvas.displayName = "LabelingCanvas"
