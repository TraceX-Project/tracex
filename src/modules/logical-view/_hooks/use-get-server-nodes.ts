import { useMutation } from '@tanstack/react-query';
import { type GetServerNodesRequest } from '../_types/logical-view';
import { getServerNodes } from '../_services/devices.service';

export const useGetServerNodes = () => {
  return useMutation({
    mutationFn: (data: GetServerNodesRequest) => getServerNodes(data),
  });
};
