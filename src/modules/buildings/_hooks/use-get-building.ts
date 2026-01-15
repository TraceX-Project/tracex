import { QUERY_KEYS } from '@/shared/constants/query-key';
import { useQuery } from '@tanstack/react-query';
import { getBuildingById } from '../_services/buildings.service';

export const useGetBuildingById = (buildingId: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.buildings, buildingId],
    queryFn: () => getBuildingById(buildingId),
    enabled: !!buildingId,
  });
