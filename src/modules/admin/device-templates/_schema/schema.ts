import { z } from 'zod';
import { Vendor, DeviceType, Alignment, PortType } from '../_types/device-template';
import { PORT_PREFIX_REGEX } from '@/shared/constants/regex';

export const deviceTemplateSchema = z
  .object({
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
    alignment: z.enum(Alignment).optional(),
    portRanges: z
      .array(
        z
          .object({
            start: z
              .number({ message: 'Start port must be a number' })
              .min(1, { message: 'Start port must be greater than zero' }),
            end: z
              .number({ message: 'End port must be a number' })
              .min(1, { message: 'End port must be greater than zero' }),
            prefix: z.string({ message: 'Prefix must be a string' }).regex(PORT_PREFIX_REGEX, {
              message: 'Prefix must be in format X/Y (e.g., 1/0, 2/1)',
            }),
            runningNumber: z
              .number({ message: 'Running number must be a number' })
              .min(1, { message: 'Running number must be greater than zero' }),
            portType: z.enum(PortType, { message: 'Port type must be a valid port type' }),
            id: z.uuidv4(),
          })
          .refine((value) => value.start <= value.end, {
            message: 'Start port must be less than or equal to end port',
            path: ['end'],
          })
      )
      .optional(),
    boundingBoxes: z
      .array(
        z.object({
          x: z.number({ message: 'X coordinate must be a number' }),
          y: z.number({ message: 'Y coordinate must be a number' }),
          width: z.number({ message: 'Width must be a number' }),
          height: z.number({ message: 'Height must be a number' }),
          portNumber: z.number({ message: 'Port number must be a number' }),
        })
      )
      .optional(),
  })
  .check((ctx) => {
    if (ctx.value.deviceType !== DeviceType.SERVER) {
      if (!ctx.value.alignment) {
        ctx.issues.push({
          code: 'custom',
          message: 'Alignment is required',
          input: ctx.value,
        });
      }

      if (!ctx.value.portRanges || ctx.value.portRanges.length === 0) {
        ctx.issues.push({
          code: 'custom',
          message: 'Port ranges is required',
          input: ctx.value,
        });
      }

      if (!ctx.value.boundingBoxes || ctx.value.boundingBoxes.length === 0) {
        ctx.issues.push({
          code: 'custom',
          message: 'Bounding boxes is required',
          input: ctx.value,
        });
      }
    }
  });

export const stepSchemas = {
  info: deviceTemplateSchema.pick({
    modelName: true,
    vendor: true,
    deviceType: true,
    unitSize: true,
    frontPanel: true,
  }),
  labeling: deviceTemplateSchema.pick({
    boundingBoxes: true,
    alignment: true,
    portRanges: true,
  }),
};
