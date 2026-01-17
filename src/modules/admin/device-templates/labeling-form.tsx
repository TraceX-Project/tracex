import { type FormType } from "@/shared/tanstack-form/form"
import { useStore } from "@tanstack/react-form"
import { Alignment, type BoundingBox, type DeviceTemplateFormData } from "./_types/device-template"

import { useRef, useState, useEffect, useMemo } from 'react';
import useImage from 'use-image';
import { useResizeObserver } from '@/shared/hooks/use-resize-observer';
import { usePredictPorts } from './_hooks/use-predict-ports';
import { useGetPredictResults } from './_hooks/use-get-predict-results';
import LabelingPortConfiguration from "./labeling-port-configuration";
import { LabelingCanvas } from "./labeling-canvas";
import { LabelingToolbar } from "./labeling-toolbar";

type Props = {
  form: FormType
}

const LabelingForm = ({ form }: Props) => {
  const frontPanelFile = useStore(
    form.store,
    (state) => (state.values as DeviceTemplateFormData).frontPanel
  )

  const alignment = useStore(
    form.store,
    (state) => (state.values as DeviceTemplateFormData).alignment
  )

  const [taskId, setTaskId] = useState<string | null>(null)
  const { mutateAsync: predictPorts } = usePredictPorts();
  const { data: predictBoxes } = useGetPredictResults(taskId ?? '');
  const [boxes, setBoxes] = useState<BoundingBox[]>([])

  useEffect(() => {
    const handlePredictPorts = async () => {
      if (frontPanelFile instanceof File) {
        const data = await predictPorts(frontPanelFile)
        setTaskId(data.taskId)
      }
    }

    handlePredictPorts()
  }, [frontPanelFile, predictPorts])

  useEffect(() => {
    if (!predictBoxes?.ports) return;

    const newBoxes = predictBoxes.ports.map((p, i) => ({
      x: p.x,
      y: p.y,
      width: p.w,
      height: p.h,
      portNumber: i + 1,
    }));

    setBoxes(newBoxes);
  }, [predictBoxes?.ports])



  /* ---------- image url ---------- */
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const url = URL.createObjectURL(frontPanelFile)
    setImageUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [frontPanelFile])

  const [image] = useImage(imageUrl ?? '', "anonymous")

  /* ---------- stage ---------- */
  const containerRef = useRef<HTMLDivElement>(null);
  const { width = 0, height = 0 } = useResizeObserver({ ref: containerRef as React.RefObject<HTMLElement> });

  const scale = useMemo(() => {
    if (!image || width === 0 || height === 0) {
      return 1;
    }

    const items = [
      width / image.width,
      height / image.height,
    ];

    return Math.min(...items);
  }, [image, width, height]);

  const handleAdd = () => undefined

  const handleDelete = () => undefined

  const handleReindex = (alignment: Alignment) => undefined

  return (
    <div className="flex h-full flex-col gap-4">
      <LabelingCanvas
        ref={containerRef}
        width={width}
        height={height}
        image={image}
        scale={scale}
        boxes={boxes}
      />

      <LabelingToolbar
        alignment={alignment ?? Alignment.HORIZONTAL}
        onAdd={handleAdd}
        onDelete={handleDelete}
        onReindex={handleReindex}
      />

      <LabelingPortConfiguration form={form} />
    </div>
  )
}

export default LabelingForm