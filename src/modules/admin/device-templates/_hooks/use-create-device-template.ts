import { useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { getQueryClient } from '@/shared/tanstack-query/get-query-client';
import { createDeviceTemplate } from '../_services/device-templates.service';
import { DeviceTemplateFormData, DeviceType } from '../_types/device-template';

export const useCreateDeviceTemplate = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: (data: DeviceTemplateFormData) => {
      const formData = new FormData();

      formData.append('modelName', data.modelName);
      formData.append('vendor', data.vendor);
      formData.append('deviceType', data.deviceType);
      formData.append('unitSize', data.unitSize.toString());
      formData.append('frontPanel', data.frontPanel);

      if (data.deviceType !== DeviceType.SERVER) {
        formData.append('alignment', data.alignment ?? 'HORIZONTAL');
        formData.append('boundingBoxes', JSON.stringify(data.boundingBoxes));
        formData.append('portRanges', JSON.stringify(data.portRanges));
      }

      return createDeviceTemplate(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.deviceTemplates] });
    },
  });
};
