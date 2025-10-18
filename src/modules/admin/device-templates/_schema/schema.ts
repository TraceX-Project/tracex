import { z } from 'zod';
import { Vendor, DeviceType, Alignment } from '../_types/device-template';

export const deviceTemplateSchema = z.object({
  modelName: z
    .string()
    .min(1, {
      message: 'Model name is required',
    })
    .max(30, {
      message: 'Model name must be at most 30 characters',
    }),
  vendor: z.enum(Vendor, {
    message: 'Vendor is required',
  }),
  deviceType: z.enum(DeviceType, {
    message: 'Type is required',
  }),
  rows: z
    .number({ message: 'Rows must be a number' })
    .int({ message: 'Rows must be an integer' })
    .positive({ message: 'Rows must be greater than zero' }),
  columns: z
    .number({ message: 'Columns must be a number' })
    .int({ message: 'Columns must be an integer' })
    .positive({ message: 'Columns must be greater than zero' }),
  alignment: z.enum(Alignment, { message: 'Alignment is required' }),
  unitSize: z
    .number({ message: 'Unit size must be a number' })
    .int({ message: 'Unit size must be an integer' })
    .positive({ message: 'Unit size must be greater than zero' }),
  frontPanel: z
    .instanceof(File, { message: 'Front panel must be a valid file' })
    .refine((file) => !!file, { message: 'Front panel image is required' })
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: 'File size must be less than 2MB',
    })
    .refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
      message: 'Only JPEG and PNG files are accepted',
    }),
  ports: z.array(
    z.object({
      x: z.number({ message: 'X coordinate must be a number' }),
      y: z.number({ message: 'Y coordinate must be a number' }),
      w: z
        .number({ message: 'Width must be a number' })
        .positive({ message: 'Width must be greater than zero' }),
      h: z
        .number({ message: 'Height must be a number' })
        .positive({ message: 'Height must be greater than zero' }),
    })
  ),
});

export const stepSchemas = {
  Basic: deviceTemplateSchema.pick({
    vendor: true,
    modelName: true,
    deviceType: true,
    unitSize: true,
  }),
  Upload: deviceTemplateSchema.pick({
    frontPanel: true,
    rows: true,
    columns: true,
  }),
  Labelling: deviceTemplateSchema.pick({
    ports: true,
    alignment: true,
  }),
};
