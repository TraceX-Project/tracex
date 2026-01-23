import { QUERY_KEYS } from '@/shared/constants/query-key';
import { useQuery } from '@tanstack/react-query';
import { getLogicalDeviceById } from '../_services/devices.service';

export const useGetLogicalDevice = (id: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.logicalDevices, id],
    queryFn: () => getLogicalDeviceById(id),
    enabled: !!id,
  });
