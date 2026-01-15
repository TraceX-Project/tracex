import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { getDeviceTemplates } from '../_services/device-templates.service';
import { type GetDeviceTemplatesParams } from '../_types/device-template';

export const useGetDeviceTemplates = (params?: GetDeviceTemplatesParams) =>
  useQuery({
    queryKey: [QUERY_KEYS.deviceTemplates, params],
    queryFn: () => getDeviceTemplates(params),
  });
