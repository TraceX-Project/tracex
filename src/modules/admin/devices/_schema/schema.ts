import { file, z } from 'zod';
import {
  DEVICE_ACCEPTED_FILE_TYPES,
  DEVICE_MAX_FILE_SIZE,
  DeviceBrand,
  DeviceType,
} from '../_constants/device';

export const projectSchema = z.object({
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
  //   frontPanel: z
  //     .instanceof(File)
  //     .nullable()
  //     .refine((file) => file === null || file.size <= DEVICE_MAX_FILE_SIZE, {
  //       message: 'Front panel image must be less than 2MB',
  //     })
  //     .refine((file) => file === null || DEVICE_ACCEPTED_FILE_TYPES.includes(file.type), {
  //       message: 'Front panel image must be a JPEG or PNG',
  //     }),
});
