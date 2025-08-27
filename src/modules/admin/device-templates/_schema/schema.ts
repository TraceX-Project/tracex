import { z } from 'zod';
import { DeviceBrand, DeviceType } from '../_types/device-template';

export const deviceTemplateSchema = z.object({
  modelName: z
    .string()
    .min(1, {
      message: 'Model name is required',
    })
    .max(30, {
      message: 'Model name must be at most 30 characters',
    }),
  brand: z.enum(DeviceBrand, {
    message: 'Brand is required',
  }),
  type: z.enum(DeviceType, {
    message: 'Type is required',
  }),
  unitSize: z
    .number({ message: 'Unit size must be a number' })
    .int({ message: 'Unit size must be an integer' })
    .positive({ message: 'Unit size must be greater than zero' }),
  frontPanelId: z.string().uuid({
    message: 'Front panel ID must be a valid UUID',
  }),
  backPanelId: z.string().uuid({
    message: 'Back panel ID must be a valid UUID',
  }),
});
