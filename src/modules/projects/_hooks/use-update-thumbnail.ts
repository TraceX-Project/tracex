import { useMutation } from '@tanstack/react-query';
import { getQueryClient } from '@/shared/tanstack-query/get-query-client';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { captureAndSaveThumbnail } from '../_utils/thumbnail';
import { useCallback, useEffect } from 'react';

const pendingUpdates = new Map<string, NodeJS.Timeout>();
const DEBOUNCE_MS = 2000;

export const useUpdateThumbnail = () => {
  const queryClient = getQueryClient();

  const { mutate, ...mutation } = useMutation({
    mutationFn: async ({ projectId }: { projectId: string }) => {
      return await captureAndSaveThumbnail(projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.projects] });
    },
  });

  const triggerUpdate = useCallback(
    ({ projectId, forceImmediate = false }: { projectId: string; forceImmediate?: boolean }) => {
      if (pendingUpdates.has(projectId)) {
        clearTimeout(pendingUpdates.get(projectId));
        pendingUpdates.delete(projectId);
      }

      const performUpdate = () => {
        pendingUpdates.delete(projectId);
        mutate({ projectId });
      };

      if (forceImmediate) {
        performUpdate();
        return;
      }

      const timer = setTimeout(() => {
        performUpdate();
      }, DEBOUNCE_MS);

      pendingUpdates.set(projectId, timer);
    },
    [mutate]
  );

  useEffect(() => {
    const handleUnload = () => {
      for (const [projectId, timer] of pendingUpdates.entries()) {
        clearTimeout(timer);
        pendingUpdates.delete(projectId);
        captureAndSaveThumbnail(projectId).catch(console.error);
      }
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  return {
    mutate,
    ...mutation,
    triggerUpdate,
  };
};
