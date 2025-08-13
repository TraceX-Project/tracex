'use client';

import { Button } from '@/shared/components/ui/button';
import { useCallback } from 'react';
import { generateThumbnail } from './_utils/thumbnail';

type Props = {
  id: string;
};

const CaptureThumbnail = ({ id }: Props) => {
  const captureThumbnail = useCallback(async () => {
    try {
      await generateThumbnail(id);
    } catch (error) {
      console.error('Error capturing thumbnail:', error);
    }
  }, [id]);

  return <Button onClick={captureThumbnail}>Capture</Button>;
};

export default CaptureThumbnail;
