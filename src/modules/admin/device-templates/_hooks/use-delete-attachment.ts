import { useMutation } from '@tanstack/react-query';
import { attachmentsService } from '../_services/attachments.service';

export const useDeleteAttachment = () => {
  return useMutation({
    mutationFn: (id: string) => attachmentsService.delete(id),
  });
};
