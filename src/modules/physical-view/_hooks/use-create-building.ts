import { useMutation } from '@tanstack/react-query';
import { CreateBuildingRequest } from '../_types/buildings';
import { createBuilding } from '../_services/buildings.service';

export const useCreateBuilding = () =>
  useMutation({
    mutationFn: ({ projectId, payload }: { projectId: string; payload: CreateBuildingRequest }) =>
      createBuilding(projectId, payload),
  });
