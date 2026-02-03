import { useMutation } from '@tanstack/react-query';
import { updateThumbnail } from '../_services/projects.service';
import { getQueryClient } from '@/shared/tanstack-query/get-query-client';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { generateThumbnail } from '../_utils/thumbnail';

export const useUpdateThumbnail = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: async ({ projectId }: { projectId: string }) => {
      const imageBuffer = await generateThumbnail(projectId);
      const blob = new Blob([new Uint8Array(imageBuffer)], { type: 'image/png' });
      const file = new File([blob], `${projectId}.png`, { type: 'image/png' });
      const formData = new FormData();
      formData.append('file', file);
      
      return await updateThumbnail(projectId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.projects] });
    },
  });
};
