import { ENDPOINTS } from '@/shared/config/endpoints';
import { request } from '@/shared/lib/api';
import { type UploadAttachmentResponse } from '../_types/attachments';

export const uploadAttachment = async (formData: FormData) => {
  const response = await request<UploadAttachmentResponse>({
    method: 'POST',
    path: ENDPOINTS.attachments.upload,
    body: formData,
  });

  return response;
};

export const deleteAttachment = async (attachmentId: string) => {
  const response = await request({
    method: 'DELETE',
    path: ENDPOINTS.attachments.delete(attachmentId),
  });

  return response;
};
