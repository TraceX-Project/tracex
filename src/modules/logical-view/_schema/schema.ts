import z from 'zod';

export const createDeviceSchema = z.object({
  deviceTemplateId: z.string().uuid({
    message: 'Invalid device template ID',
  }),
  files: z.array(z.instanceof(File)).min(1, {
    message: 'At least one file must be uploaded',
  }),
});
