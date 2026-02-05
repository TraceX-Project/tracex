import { useMutation } from '@tanstack/react-query';
import { updateThumbnail } from '../_services/projects.service';
import { getQueryClient } from '@/shared/tanstack-query/get-query-client';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { generateThumbnail } from '../_utils/thumbnail';
import { convertBufferToFile } from '@/shared/utils/file';

export const useUpdateThumbnail = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: async ({ projectId }: { projectId: string }) => {
      const imageBuffer = await generateThumbnail(projectId);

      const file = convertBufferToFile(imageBuffer, `${projectId}-${Date.now()}.png`);

      const formData = new FormData();
      formData.append('file', file);

      return await updateThumbnail(projectId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.projects] });
    },
  });
};
