import { useMutation } from '@tanstack/react-query';
import { updateThumbnail } from '../_services/projects.service';

export const useUpdateThumbnail = () => {
  return useMutation({
    mutationFn: async ({ projectId, formData }: { projectId: string; formData: FormData }) =>
      updateThumbnail(projectId, formData),
  });
};
