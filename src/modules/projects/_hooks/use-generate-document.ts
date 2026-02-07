import { useMutation } from '@tanstack/react-query';
import { generateDocument } from '../_services/projects.service';
import { type DocumentFormat } from '../_types/projects';

export const useGenerateDocument = () => {
  return useMutation({
    mutationFn: ({ projectId, format }: { projectId: string; format: DocumentFormat }) =>
      generateDocument(projectId, format),
  });
};
