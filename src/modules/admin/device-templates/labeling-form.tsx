import React, { useEffect, useRef, useState } from 'react';
import type Konva from 'konva';
import useImage from 'use-image';
import { Stage, Layer, Image as KImage, Rect, Transformer, Group, Text } from 'react-konva';
import { Button } from '@/shared/components/ui/button';
import { type useAppForm } from '@/shared/tanstack-form/form'; // ปรับ import path ตามจริง
import { ArrowDownUp, ArrowLeftRight, Plus, Trash2 } from 'lucide-react';
import { useCreatePorts } from './_hooks/use-create-ports';
import { useGetPorts } from './_hooks/use-get-ports';
import { type KonvaEventObject } from 'konva/lib/Node';
import PortTypeConfiguration from './port-range-configuration'; // ปรับ import path ตามจริง
import { Alignment, type boundingBox } from './_types/device-template';



type Props = {
  form: ReturnType<typeof useAppForm>;
};

const LabelingForm = ({ form }: Props) => {
  // --- State Management ---
  const [boxes, setBoxes] = useState<boundingBox[]>(
    (form.getFieldValue('boundingBoxes') as boundingBox[]) || []
  );

  const [imageURL] = useState(() => {
    const file = form.getFieldValue('frontPanel') as File | undefined;
    return file ? URL.createObjectURL(file) : '';
  });

  const [image] = useImage(imageURL);
  const { mutateAsync: createPorts } = useCreatePorts();
  
  // UI State
  const [stageSize, setStageSize] = useState({ width: 800, height: 200 });
  const [taskId, setTaskId] = useState<string>("");
  const { data: portData, isLoading: isPortsLoading } = useGetPorts(taskId);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Refs
  const rectRefs = useRef<(Konva.Rect | null)[]>([]);
  const trRef = useRef<Konva.Transformer>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Calculations ---
  const displayWidth = Math.min(stageSize.width - 50, 750);
  // คำนวณ Aspect Ratio เพื่อไม่ให้รูปเพี้ยน
  const originalWidth = image?.width ?? displayWidth;
  const originalHeight = image?.height ?? 1; // กันหารด้วย 0
  const imageAspectRatio = originalHeight / originalWidth;
  
  const displayHeight = displayWidth * imageAspectRatio;

  const scaleX = displayWidth / originalWidth;
  const scaleY = displayHeight / originalHeight;
  
  const offsetX = (stageSize.width - displayWidth) / 2;
  const offsetY = (stageSize.height - displayHeight) / 2;

  // --- Helpers ---
  const syncForm = (newBoxes: boundingBox[]) => {
    setBoxes(newBoxes);
    form.setFieldValue('boundingBoxes', newBoxes);
  };

  // --- Effects ---

  // Resize Window Handler
  useEffect(() => {
    const updateStageSize = () => {
      const containerWidth = containerRef.current?.offsetWidth ?? 800;
      const maxWidth = Math.min(containerWidth, 1200);
      const calculatedHeight = Math.max(200, maxWidth * imageAspectRatio + 100);

      setStageSize({
        width: maxWidth,
        height: Math.min(calculatedHeight, 800),
      });
    };
    updateStageSize();
    window.addEventListener('resize', updateStageSize);
    return () => window.removeEventListener('resize', updateStageSize);
  }, [image, imageAspectRatio]);

  // AI Processing (First Run)
  useEffect(() => {
    const run = async () => {
      const file = form.getFieldValue('frontPanel') as File;
      if (file && !taskId) {
        try {
            const result = await createPorts([file]);
            setTaskId(result?.taskId || '');
        } catch (e) {
            console.error("AI Processing failed", e);
        }
      }
    };
    run();
  }, [form, taskId, createPorts]);

  // Sync Data from AI Hook to Form
  useEffect(() => {
    if (!isPortsLoading && portData?.ports) {
      // Map ข้อมูลจาก AI (w, h) มาเป็น boundingBox (width, height, portNumber)
      const mappedBoxes: boundingBox[] = portData.ports.map((p: any, index: number) => ({
        x: p.x,
        y: p.y,
        width: p.w, // Map w -> width
        height: p.h, // Map h -> height
        portNumber: index + 1
      }));
      syncForm(mappedBoxes);
    }
  }, [isPortsLoading, portData]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Backspace" || e.key === "Delete") {
        const updated = boxes.filter((_, i) => i !== selectedIndex);
        syncForm(updated);
        setSelectedIndex(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, boxes]);

  // Transformer Attachment
  useEffect(() => {
    if (selectedIndex !== null && trRef.current && rectRefs.current[selectedIndex]) {
      trRef.current.nodes([rectRefs.current[selectedIndex]]);
      trRef.current.getLayer()?.batchDraw();
    } else if (trRef.current) {
      trRef.current.nodes([]);
    }
  }, [selectedIndex, boxes]);

  // --- Handlers ---

  const handleAddBox = () => {
    const defaultW = 50 / scaleX;
    const defaultH = 50 / scaleY;
    const lastBox = boxes.length > 0 ? boxes[boxes.length - 1] : null;

    // หาเลข Port ถัดไปที่ยังไม่ซ้ำ (Max + 1)
    const maxPortNum = boxes.reduce((max, box) => Math.max(max, box.portNumber), 0);

    const newBox: boundingBox = {
      x: lastBox ? lastBox.x + (20/scaleX) : (10/scaleX),
      y: lastBox ? lastBox.y : (10/scaleY),
      width: lastBox ? lastBox.width : defaultW,
      height: lastBox ? lastBox.height : defaultH,
      portNumber: maxPortNum + 1
    };

    const updated = [...boxes, newBox];
    syncForm(updated);
    setSelectedIndex(updated.length - 1);
  };

  const handleStageMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    const clickedOnImage = e.target.attrs.image === image;
    if (clickedOnEmpty || clickedOnImage) {
      setSelectedIndex(null);
    }
  };

  // Drag End: Update Position
  const handleDragEnd = (e: KonvaEventObject<DragEvent>, index: number) => {
    const newX = (e.target.x() - offsetX) / scaleX;
    const newY = (e.target.y() - offsetY) / scaleY;

    const updated = [...boxes];
    updated[index] = { ...updated[index], x: newX, y: newY };
    syncForm(updated);
  };

  // Transform End: Update Size & Position
  const handleTransformEnd = (index: number) => {
    const node = rectRefs.current[index];
    if (!node) return;

    const currentScaleX = node.scaleX();
    const currentScaleY = node.scaleY();

    // Reset scale to 1 to clean up
    node.scaleX(1);
    node.scaleY(1);

    // Calculate new dimensions in Screen Pixels -> convert to Original
    const newWidth = (node.width() * currentScaleX) / scaleX;
    const newHeight = (node.height() * currentScaleY) / scaleY;

    // Calculate shift in position (if resized from top/left)
    const shiftX = node.x() / scaleX;
    const shiftY = node.y() / scaleY;

    // Reset node position inside group
    node.x(0);
    node.y(0);

    const updated = [...boxes];
    updated[index] = {
      ...updated[index],
      x: updated[index].x + shiftX,
      y: updated[index].y + shiftY,
      width: newWidth,
      height: newHeight,
    };
    syncForm(updated);
  };

  const handleConsoleLog = () => {
    console.log(form.getFieldValue('modelName'),form.getFieldValue('vendor'),form.getFieldValue('deviceType'),form.getFieldValue('rows'),form.getFieldValue('columns'),form.getFieldValue('alignment'),form.getFieldValue('frontPanel'),form.getFieldValue('unitSize'),form.getFieldValue('portRanges'),form.getFieldValue('boundingBoxs'));
  }

  // Sort & Re-index Port Numbers
  const handleReindex = (mode: "horizontal" | "vertical") => {
    // 1. Sort boxes geometry
    const sorted = [...boxes].sort((a, b) => {
      if (mode === "horizontal") {
        // Sort by X first, then Y (Left -> Right, Top -> Bottom)
        // ใส่ Threshold เล็กน้อย (เช่น 10px) เพื่อให้แถวเดียวกันแม้ y ต่างกันนิดหน่อยยังนับเป็นแถวเดิม
        const yDiff = Math.abs(a.y - b.y);
        if (yDiff > (10 / scaleY)) return a.y - b.y;
        return a.x - b.x;
      } else {
        // Sort by Y first, then X (Top -> Bottom, Left -> Right) - สำหรับตู้ Rack แนวตั้ง
        const xDiff = Math.abs(a.x - b.x);
        if (xDiff > (10 / scaleX)) return a.x - b.x;
        return a.y - b.y;
      }
    });

    // 2. Re-assign port numbers
    const reindexed = sorted.map((box, idx) => ({
      ...box,
      portNumber: idx + 1
    }));

    syncForm(reindexed);
    
    // Update Alignment in Form
    form.setFieldValue('alignment', mode === "horizontal" ? Alignment.HORIZONTAL : Alignment.VERTICAL);
  };

  if (!imageURL && !taskId) {
    return <div className="p-10 text-center text-gray-500">Loading or please upload an image...</div>;
  }

  return (
    <div className="space-y-6">
      <div
        ref={containerRef}
        className="w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 relative select-none"
      >
        <Stage
          width={stageSize.width}
          height={stageSize.height}
          onMouseDown={handleStageMouseDown}
          onTouchStart={() => handleStageMouseDown}
        >
          <Layer>
            <KImage
              image={image}
              width={displayWidth}
              height={displayHeight}
              x={offsetX}
              y={offsetY}
            />

            {boxes.map((box, i) => (
              <Group
                key={`box-${i}`} // ใช้ index หรือสร้าง id ถาวรถ้ามี
                x={box.x * scaleX + offsetX}
                y={box.y * scaleY + offsetY}
                draggable
                onDragEnd={(e) => handleDragEnd(e, i)}
                onClick={(e) => {
                  e.cancelBubble = true;
                  setSelectedIndex(i);
                }}
              >
                {/* Hit Box for easier selection */}
                <Rect 
                    width={box.width * scaleX}
                    height={box.height * scaleY}
                    fill="transparent"
                />
                
                {/* Visible Box */}
                <Rect
                  ref={(el) => { rectRefs.current[i] = el; }}
                  width={Math.max(5, box.width * scaleX)}
                  height={Math.max(5, box.height * scaleY)}
                  stroke={selectedIndex === i ? "red" : "#39FF14"}
                  strokeWidth={2}
                  onTransformEnd={() => handleTransformEnd(i)}
                />

                {/* Port Number Label */}
                <Text
                  text={String(box.portNumber)}
                  x={0}
                  y={-20} // ลอยอยู่เหนือกล่อง
                  width={box.width * scaleX} // จัดกึ่งกลาง
                  align="center"
                  fontSize={14}
                  fill="white"
                  fontStyle="bold"
                  shadowColor="black"
                  shadowBlur={3}
                  listening={false} // ให้คลิกทะลุไปโดนกล่องได้
                />
              </Group>
            ))}

            <Transformer
              ref={trRef}
              rotateEnabled={false}
              keepRatio={false}
              anchorSize={8}
              borderStroke="red"
              anchorStroke="red"
              anchorFill="white"
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) return oldBox;
                return newBox;
              }}
            />
          </Layer>
        </Stage>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="button" onClick={handleAddBox} className="gap-2">
          <Plus size={16} /> Add Box
        </Button>
        
        <div className="h-6 w-px bg-gray-300 mx-2" />

        <Button
          type="button"
          variant="outline"
          onClick={() => handleReindex("horizontal")}
          title="Sort Left->Right, Top->Bottom"
        >
          <ArrowLeftRight className="mr-2 h-4 w-4" /> Auto Sort (H)
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => handleReindex("vertical")}
          title="Sort Top->Bottom, Left->Right"
        >
          <ArrowDownUp className="mr-2 h-4 w-4" /> Auto Sort (V)
        </Button>
        <Button onClick={handleConsoleLog}>console log</Button>

        {selectedIndex !== null && (
             <Button
             type="button"
             variant="destructive"
             size="icon"
             className="ml-auto"
             onClick={() => {
                const updated = boxes.filter((_, i) => i !== selectedIndex);
                syncForm(updated);
                setSelectedIndex(null);
             }}
           >
             <Trash2 size={16} />
           </Button>
        )}
      </div>

      {/* Interface Configuration Component */}
      <PortTypeConfiguration form={form} />
    </div>
  );
};

export default LabelingForm;