import { QUERY_KEYS } from '@/shared/constants/query-key';
import { useQuery } from '@tanstack/react-query';
import { getPhysicalDevices } from '../_services/room.service';
import { type GetDevicesInProjectParams } from '../_types/room';

export const useGetPhysicalDevices = (projectId: string, params?: GetDevicesInProjectParams) =>
  useQuery({
    queryKey: [QUERY_KEYS.physicalDevices, projectId, params],
    queryFn: () => getPhysicalDevices(projectId, params),
    enabled: !!projectId,
  });
