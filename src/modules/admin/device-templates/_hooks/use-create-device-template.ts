import { useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { getQueryClient } from '@/shared/tanstack-query/get-query-client';
import { createDeviceTemplate } from '../_services/device-templates.service';
import { type CreateDeviceTemplateRequest } from '../_types/device-template';

export const useCreateDeviceTemplate = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => createDeviceTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.deviceTemplates] });
    },
  });
};
