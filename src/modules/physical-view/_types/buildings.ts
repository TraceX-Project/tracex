import { createBuildingSchema } from '../_schema.ts/schema';
import { z } from 'zod';
import { Location } from '../_store/physical-map.store';

export type CreateBuildingRequest = z.infer<typeof createBuildingSchema>;

export type Building = {
  id: string;
  name: string;
  location: Location;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
};
