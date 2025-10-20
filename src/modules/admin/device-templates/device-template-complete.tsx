import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image as KImage, Rect, Transformer } from 'react-konva';
import useImage from 'use-image';
import { DEVICE_INTERFACES_TYPES_OPTIONS } from './_constants/device-template';
import { PortInput } from './_types/device-template';

type InterfaceRow = {
  id: string;
  interfaceType: string;
  startPort: number;
  endPort: number;
  prefix: string;
  runningNumber: number;
};
import { Button } from '@/shared/components/ui/button';
import Konva from 'konva';

type DeviceTemplateStepperProps = {
  form: any;
};

export const DeviceTemplateComplete = ({ form }: DeviceTemplateStepperProps) => {
  const [ports, setPorts] = useState<PortInput[]>(form.getFieldValue('ports') || []);
  const [interfaceRows, setInterfaceRows] = useState<InterfaceRow[]>(
    form.getFieldValue('interfaceRows') || [
      {
        id: Date.now().toString(),
        interfaceType: '',
        startPort: 0,
        endPort: 0,
        prefix: '',
        runningNumber: 1,
      },
    ]
  );
  const [imageURL, setImageURL] = useState(
    form.getFieldValue('frontPanel')
      ? String(URL.createObjectURL(form.getFieldValue('frontPanel')))
      : ''
  );
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

  const handleAddInterfaceRow = () => {
    const newRow: InterfaceRow = {
      id: Date.now().toString(),
      interfaceType: '',
      startPort: 0,
      endPort: 0,
      prefix: '',
      runningNumber: 1,
    };
    const updated = [...interfaceRows, newRow];
    setInterfaceRows(updated);
    form.setFieldValue('interfaceRows', updated);
  };

  const handleRemoveInterfaceRow = (id: string) => {
    if (interfaceRows.length > 1) {
      const updated = interfaceRows.filter((row) => row.id !== id);
      setInterfaceRows(updated);
      form.setFieldValue('interfaceRows', updated);
    }
  };

  const handleUpdateInterfaceRow = (id: string, field: keyof InterfaceRow, value: any) => {
    const updated = interfaceRows.map((row) => (row.id === id ? { ...row, [field]: value } : row));
    setInterfaceRows(updated);
    form.setFieldValue('interfaceRows', updated);
  };

  // Responsive stage dimensions
  useEffect(() => {
    const updateStageSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const maxWidth = Math.min(containerWidth, 1200); // Maximum width
        const aspectRatio = 60 / 750; // Original aspect ratio
        const calculatedHeight = Math.max(100, maxWidth * aspectRatio * 1.5); // Minimum height with padding

        setStageSize({
          width: maxWidth,
          height: Math.min(calculatedHeight, 300), // Maximum height
        });
      }
    };

    updateStageSize();
    window.addEventListener('resize', updateStageSize);

    return () => window.removeEventListener('resize', updateStageSize);
  }, []);

  // Calculate responsive display dimensions
  const displayWidth = Math.min(stageSize.width - 50, 750); // Leave some padding
  const displayHeight = Math.min(displayWidth * (60 / 750), stageSize.height - 50);

  const originalWidth = image?.width || displayWidth;
  const originalHeight = image?.height || displayHeight;

  const scaleX = displayWidth / originalWidth;
  const scaleY = displayHeight / originalHeight;

  useEffect(() => {
    console.log('ports', ports);
    if (trRef.current && rectRef.current) {
      trRef.current.nodes([rectRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [image, stageSize]);

  return (
    <div className="space-y-6">
      {/* Image Preview with Resizable Rectangle */}
      <div
        ref={containerRef}
        className="w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
        style={{ minHeight: '150px' }}
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
            {ports &&
              ports.map((port, index) => (
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

      {/* Interface Configuration Rows */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Interface Configuration</h3>
          <Button type="button" onClick={handleAddInterfaceRow} className="text-sm">
            ➕ Add Row
          </Button>
        </div>

        {interfaceRows.map((row, index) => (
          <div key={row.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Row {index + 1}</span>
              {interfaceRows.length > 1 && (
                <Button
                  type="button"
                  onClick={() => handleRemoveInterfaceRow(row.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  🗑️ Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Interface Type
                </label>
                <select
                  value={row.interfaceType}
                  onChange={(e) =>
                    handleUpdateInterfaceRow(row.id, 'interfaceType', e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select a type</option>
                  {DEVICE_INTERFACES_TYPES_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Start at</label>
                <input
                  type="number"
                  value={row.startPort || ''}
                  onChange={(e) =>
                    handleUpdateInterfaceRow(row.id, 'startPort', parseInt(e.target.value) || 0)
                  }
                  placeholder="Enter start port"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">End at</label>
                <input
                  type="number"
                  value={row.endPort || ''}
                  onChange={(e) =>
                    handleUpdateInterfaceRow(row.id, 'endPort', parseInt(e.target.value) || 0)
                  }
                  placeholder="Enter end port"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Prefix</label>
                <input
                  type="text"
                  value={row.prefix}
                  onChange={(e) => handleUpdateInterfaceRow(row.id, 'prefix', e.target.value)}
                  placeholder="Enter prefix"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Running Number
                </label>
                <input
                  type="number"
                  value={row.runningNumber || ''}
                  onChange={(e) =>
                    handleUpdateInterfaceRow(row.id, 'runningNumber', parseInt(e.target.value) || 1)
                  }
                  placeholder="Enter running number"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
