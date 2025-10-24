import { z } from 'zod';

export const createBuildingSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
  location: z.object({
    lat: z
      .number()
      .min(-90, {
        message: 'Latitude must be between -90 and 90',
      })
      .max(90, {
        message: 'Latitude must be between -90 and 90',
      }),
    lng: z
      .number()
      .min(-180, {
        message: 'Longitude must be between -180 and 180',
      })
      .max(180, {
        message: 'Longitude must be between -180 and 180',
      }),
  }),
});
