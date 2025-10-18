import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image as KImage, Rect, Transformer } from 'react-konva';
import useImage from 'use-image';
import { DEVICE_INTERFACES_TYPES_OPTIONS } from './_constants/device-template';
import { PortInput } from './_types/device-template';
import { Button } from '@/shared/components/ui/button';
import Konva from 'konva';

type DeviceTemplateStepperProps = {
  form: any;
};

export const DeviceTemplateComplete = ({ form }: DeviceTemplateStepperProps) => {
  const [ports, setPorts] = useState<PortInput[]>(form.getFieldValue('ports') || []);
  const [imageURL, setImageURL] = useState(
    form.getFieldValue('frontPanel')
      ? String(URL.createObjectURL(form.getFieldValue('frontPanel')))
      : ''
  );
  const [image] = useImage(imageURL);
  const rectRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);
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
    console.log('ports', ports);
    if (trRef.current && rectRef.current) {
      trRef.current.nodes([rectRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [image]);

  return (
    <div className="space-y-6">
      {/* Image Preview with Resizable Rectangle */}
      <Stage width={800} height={200}>
        <Layer>
          <KImage image={image} width={750} height={60} />
          {ports &&
            ports.map((port, index) => (
              <React.Fragment key={index}>
                <Rect
                  ref={rectRef}
                  x={port.x}
                  y={port.y}
                  width={port.w}
                  height={port.h}
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
      <div className="mt-4 flex gap-4">
        <Button type="button" onClick={handleAddBox}>
          ➕ Add Box
        </Button>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-5">
        <div>
          <form.AppField
            name="interface Type"
            children={(field: any) => (
              <field.SelectField
                label="Interface Type"
                options={DEVICE_INTERFACES_TYPES_OPTIONS}
                placeholder="Select a type"
              />
            )}
          />
        </div>
        <div>
          <form.AppField
            name="startPort"
            children={(field: any) => (
              <field.NumberField label="Start at" placeholder="Enter start port" />
            )}
          />
        </div>

        <div>
          <form.AppField
            name="endPort"
            children={(field: any) => (
              <field.NumberField label="End at" placeholder="Enter end port" />
            )}
          />
        </div>
        <div>
          <form.AppField
            name="prefix"
            children={(field: any) => <field.TextField label="Prefix" placeholder="Enter prefix" />}
          />
        </div>
        <div>
          <form.AppField
            name="runningNumber"
            children={(field: any) => (
              <field.NumberField label="Running Number" placeholder="Enter running number" />
            )}
          />
        </div>
      </div>
    </div>
  );
};
