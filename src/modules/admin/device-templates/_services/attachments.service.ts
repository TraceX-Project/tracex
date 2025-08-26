import { request } from '@/shared/lib/api';
import { ENDPOINTS } from '@/shared/config/endpoints';
import { type OutputImage } from '../_types/device-template';

export const attachmentsService = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await request<OutputImage>({
      method: 'POST',
      path: ENDPOINTS.attachments.upload,
      body: formData,
    });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await request({
      method: 'DELETE',
      path: ENDPOINTS.attachments.delete(id),
    });
    return response.data;
  },
};
