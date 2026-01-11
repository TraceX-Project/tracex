import { useMutation } from '@tanstack/react-query';
import { addDeviceToProject } from '../_services/logical-view.service';

export const useAddDevice = () => {
  return useMutation({
    mutationFn: async ({ projectId, formData }: { projectId: string; formData: FormData }) =>
      addDeviceToProject(projectId, formData),
  });
};
