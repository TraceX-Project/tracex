import { useMutation } from '@tanstack/react-query';
import { uploadAttachment } from '../_services/attachments.service';

export const useUploadAttachment = () => {
  return useMutation({
    mutationFn: (formData: FormData) => uploadAttachment(formData),
  });
};
