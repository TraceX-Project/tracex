import { useMemo } from 'react';
import useImage from 'use-image';

type StageSize = {
  width: number;
  height: number;
  padding?: number;
  fitStatus?: boolean;
};

export const useImageFitToStage = (
  frontPanelUrl: string | null,
  stageSize: StageSize,
  padding: number,
  fitStatus: boolean
) => {

  const [image] = useImage(frontPanelUrl ?? '');
  console.log("stageSize",stageSize)

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

    if (fitStatus){
      return {
        width: availableWidth,
        height: availableHeight,
        x: (stageSize.width - availableWidth) / 2,
        y: (stageSize.height - availableHeight) / 2,
        scaleX: availableWidth / image.width,
        scaleY: availableHeight / image.height,
      };
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

  console.log(width,height)

  return { image, x, y, width, height, scaleX, scaleY };
};
