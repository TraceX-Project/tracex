import { useMutation } from '@tanstack/react-query';
import { attachmentsService } from '../_services/attachments.service';

export const useUploadAttachment = () => {
  return useMutation({
    mutationFn: (file: File) => attachmentsService.upload(file),
  });
};
