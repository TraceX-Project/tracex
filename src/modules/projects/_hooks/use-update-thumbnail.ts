import { useMutation } from '@tanstack/react-query';
import { getQueryClient } from '@/shared/tanstack-query/get-query-client';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { captureAndSaveThumbnail } from '../_utils/thumbnail';
import { useCallback, useEffect } from 'react';

import { useDebouncedCallback } from '@/shared/hooks/use-debounce-callback';

const pendingProjects = new Set<string>();
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

  const debouncedMutate = useDebouncedCallback((projectId: string) => {
    pendingProjects.delete(projectId);
    mutate({ projectId });
  }, DEBOUNCE_MS);

  const triggerUpdate = useCallback(
    ({ projectId, forceImmediate = false }: { projectId: string; forceImmediate?: boolean }) => {
      if (forceImmediate) {
        pendingProjects.delete(projectId);
        mutate({ projectId });
        return;
      }

      pendingProjects.add(projectId);
      debouncedMutate(projectId);
    },
    [debouncedMutate, mutate]
  );

  useEffect(() => {
    const handleUnload = () => {
      for (const projectId of pendingProjects) {
        pendingProjects.delete(projectId);
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
