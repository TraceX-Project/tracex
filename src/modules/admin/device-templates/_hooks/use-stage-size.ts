import { useDebouncedCallback } from '@/shared/hooks/use-debounce-callback';
import { useState, useRef, useLayoutEffect, useEffect, useCallback } from 'react';

type Props = {
  defaultWidth?: number;
  defaultHeight?: number;
  padding?: number;
  debounceMs?: number;
};

export const useStageSize = ({
  defaultWidth = 800,
  defaultHeight = 200,
  padding = 4,
  debounceMs = 100,
}: Props = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [containerSize, setContainerSize] = useState({
    width: defaultWidth,
    height: defaultHeight,
  });

  const [stageSize, setStageSize] = useState({
    width: defaultWidth,
    height: defaultHeight,
  });

  const computeSize = useCallback(() => {
    const el = containerRef.current;
    if (!el) {
      return;
    }

    const width = el.offsetWidth;
    const height = el.offsetHeight;

    setContainerSize((prev) => {
      if (prev.width === width && prev.height === height) {
        return prev;
      }

      return { width, height };
    });

    setStageSize({
      width: Math.max(0, width - padding * 2),
      height: Math.max(0, height - padding * 2),
    });
  }, [padding]);

  const debouncedComputeSize = useDebouncedCallback(computeSize, debounceMs);

  // 1) Run on mount and when container first available
  useLayoutEffect(() => {
    computeSize();
  }, [computeSize]);

  // 2) Observe container resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) {
      return;
    }

    const observer = new ResizeObserver(() => {
      debouncedComputeSize();
    });

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [debouncedComputeSize]);

  // 3) Window resize support (optional)
  useEffect(() => {
    const handleResize = () => debouncedComputeSize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [debouncedComputeSize]);

  return { containerRef, containerSize, stageSize };
};
