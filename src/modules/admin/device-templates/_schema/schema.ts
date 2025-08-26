import { z } from 'zod';
import { DeviceBrand, DeviceType } from '../_constants/device-template';

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
  frontPanel: z.string().max(1000, {
    message: 'Front panel image URL must be at most 100 characters',
  }),
  backPanel: z.string().max(1000, {
    message: 'Back panel image URL must be at most 100 characters',
  }),
});
