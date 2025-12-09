import { useMemo } from 'react';
import useImage from 'use-image';

type StageSize = {
  width: number;
  height: number;
};

export const useImageFitToStage = (
  frontPanelFile: File | null,
  stageSize: StageSize,
  padding = 16
) => {
  const imageUrl = useMemo(() => {
    if (!frontPanelFile) return undefined;
    return URL.createObjectURL(frontPanelFile);
  }, [frontPanelFile]);

  const [image] = useImage(imageUrl ?? '');

  const { x, y, width, height, scaleX, scaleY } = useMemo(() => {
    if (!image || !stageSize.width || !stageSize.height) {
      return { x: 0, y: 0, width: 0, height: 0, scaleX: 1, scaleY: 1 };
    }

    const availableWidth = Math.max(stageSize.width - padding * 2, 0);
    const availableHeight = Math.max(stageSize.height - padding * 2, 0);

    const imgAspect = image.width / image.height;
    const stageAspect = availableWidth / availableHeight;

    let renderWidth, renderHeight;

    if (imgAspect > stageAspect) {
      renderWidth = availableWidth;
      renderHeight = availableWidth / imgAspect;
    } else {
      renderWidth = availableHeight * imgAspect;
      renderHeight = availableHeight;
    }

    return {
      width: renderWidth,
      height: renderHeight,
      x: (stageSize.width - renderWidth) / 2,
      y: (stageSize.height - renderHeight) / 2,
      scaleX: renderWidth / image.width,
      scaleY: renderHeight / image.height,
    };
  }, [image, stageSize, padding]);

  return { image, x, y, width, height, scaleX, scaleY };
};
