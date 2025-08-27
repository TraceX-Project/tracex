import { useMutation } from '@tanstack/react-query';
import { uploadAttachment } from '../_services/attachments.service';

export const useUploadAttachment = () => {
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();

      formData.append('file', file);

      return uploadAttachment(formData);
    },
  });
};
