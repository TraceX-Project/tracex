import React, { useCallback, useEffect, useState } from 'react';
import { useStageSize } from '@/modules/admin/device-templates/_hooks/use-stage-size';
import { useImageFitToStage } from '@/modules/admin/device-templates/_hooks/use-image-fit-to-stage';
import { usePredictPorts } from '@/modules/admin/device-templates/_hooks/use-predict-ports';
import { useGetPredictResults } from '@/modules/admin/device-templates/_hooks/use-get-predict-results';
import PortRangeConfiguration from '@/modules/admin/device-templates/port-range-configuration';
import { Alignment, type BoundingBox } from '@/modules/admin/device-templates/_types/device-template';
import { reindexBoundingBoxes } from '@/modules/admin/device-templates/_utils/utils';
import { type useAppForm } from '@/shared/tanstack-form/form';
import PortToolbar from '@/modules/admin/device-templates/port-toolbar';
import PortCanvas from '@/modules/admin/device-templates/port-canvas'; 
import { usePortBoundingBoxStore } from '@/modules/admin/device-templates/_store/port-boundingbox';

type Props = {
  form: ReturnType<typeof useAppForm>;
};

const DeviceDetailModal = ({ form }: Props) => {
  const frontPanelFile = form.getFieldValue('frontPanel') as File | null;
  const [taskId, setTaskId] = useState<string | null>(null);

  const { mutateAsync: predictPorts } = usePredictPorts();
  const { data: predictBoxes } = useGetPredictResults(taskId ?? '');

  const { containerRef, stageSize } = useStageSize();
  const { image, x, y, width, height, scaleX, scaleY } = useImageFitToStage(
    frontPanelFile,
    stageSize
  );

  const boxes = usePortBoundingBoxStore((state) => state.boxes);
  const alignment = usePortBoundingBoxStore((state) => state.alignment);
  const selectedBoxId = usePortBoundingBoxStore((state) => state.selectedBoxId);
  const { setBoxes, setAlignment, selectBox } = usePortBoundingBoxStore((state) => state.actions);

  useEffect(() => {
    const formBoxes = (form.getFieldValue('boundingBoxes') as BoundingBox[]) ?? [];
    if (formBoxes.length > 0 && boxes.length === 0) {
      setBoxes(formBoxes);
    }

    const formAlignment = form.getFieldValue('alignment') as Alignment;
    if (formAlignment) {
      setAlignment(formAlignment);
    }
  }, []);

  useEffect(() => {
    form.setFieldValue('boundingBoxes', boxes);
  }, [boxes, form]);

  useEffect(() => {
    form.setFieldValue('alignment', alignment);
  }, [alignment, form]);

  useEffect(() => {
    const formBoxes = (form.getFieldValue('boundingBoxes') as BoundingBox[]) ?? [];
    if (!frontPanelFile || taskId || boxes.length > 0 || formBoxes.length > 0) return;

    const run = async () => {
      const result = await predictPorts(frontPanelFile);
      setTaskId(result.taskId);
    };
    run();
  }, [frontPanelFile, taskId]);

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
    setAlignment(Alignment.HORIZONTAL);
    selectBox(null);

    const reindexed = reindexBoundingBoxes(newBoxes, Alignment.HORIZONTAL, scaleY, scaleX);
    setBoxes(reindexed);
  }, [predictBoxes?.ports]);

  const handleReindex = useCallback(
    (mode: Alignment) => {
      const currentBoxes = usePortBoundingBoxStore.getState().boxes;

      const reindexed = reindexBoundingBoxes(currentBoxes, mode, scaleY, scaleX);
      setBoxes(reindexed);
      setAlignment(mode);
      selectBox(null);
    },
    [boxes, scaleX, scaleY, setBoxes, setAlignment]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedBoxId !== null) {
        e.preventDefault();

        usePortBoundingBoxStore.getState().actions.deleteSelectedBox();

        handleReindex(alignment);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedBoxId, handleReindex]);

  return (
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
      />

      <PortToolbar onReindex={handleReindex} />

      <PortRangeConfiguration form={form} />
    </div>
  );
};

export default DeviceDetailModal;
