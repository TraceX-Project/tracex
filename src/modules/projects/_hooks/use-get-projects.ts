import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/query_key';
import { getProjects } from '../_services/projects.service';

export const useGetProjects = () =>
  useQuery({
    queryKey: [QUERY_KEYS.projects],
    queryFn: getProjects,
  });
