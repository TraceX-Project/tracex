import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/query_key';
import { getDeviceTemplates } from '../_services/devices.service';

export const useGetDeviceTemplates = () =>
  useQuery({
    queryKey: [QUERY_KEYS.deviceTemplates],
    queryFn: getDeviceTemplates,
  });
