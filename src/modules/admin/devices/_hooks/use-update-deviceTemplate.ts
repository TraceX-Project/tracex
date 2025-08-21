import { useMutation } from '@tanstack/react-query';
import { getQueryClient } from '@/shared/tanstack-query/get-query-client';
import { QUERY_KEYS } from '@/shared/constants/query_key';
import { updateDeviceTemplate } from '../_services/devices.service';
import { type UpdateDeviceTemplateRequest } from '../_types/device';

export const useUpdateDeviceTemplate = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: ({
      deviceTemplateId,
      data,
    }: {
      deviceTemplateId: string;
      data: UpdateDeviceTemplateRequest;
    }) => updateDeviceTemplate(deviceTemplateId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.deviceTemplates] });
    },
  });
};
