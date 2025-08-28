import { useMutation } from '@tanstack/react-query';
import { deleteAttachment } from '../_services/attachments.service';

export const useDeleteAttachment = () => {
  return useMutation({
    mutationFn: (id: string) => deleteAttachment(id),
  });
};
