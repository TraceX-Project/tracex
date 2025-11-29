import { z } from 'zod';
import { Location } from '../../physical-view/_store/physical-map.store';
import { Floor } from '@/modules/floors/_types/floor';
import { Project } from '@/modules/projects/_types/projects';
import { createBuildingSchema } from '../_schema/schema';

export type CreateBuildingRequest = z.infer<typeof createBuildingSchema>;

export type Building = {
  id: string;
  name: string;
  location: Location;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
  floors: Floor[];
  project?: Project;
};
