import { z } from 'zod';

export const createFloorSchema = z.object({
  name: z.string().min(1, {
    message: 'Floor name is required',
  }),
  floorPlan: z.instanceof(File, {
    message: 'Floor plan file is required',
  }),
});

export type CreateFloorSchema = z.infer<typeof createFloorSchema>;
