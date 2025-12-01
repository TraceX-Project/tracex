import { type z } from 'zod';
import { type Location } from '../../physical-view/_store/physical-map.store';
import { type Floor } from '@/modules/floors/_types/floor';
import { type Project } from '@/modules/projects/_types/projects';
import { type createBuildingSchema } from '../_schema/building';

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
