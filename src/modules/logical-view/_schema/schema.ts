import z from 'zod';
import { HypervisorVendor } from '../_types/logical-view';

export const createDeviceSchema = z.object({
  deviceTemplateId: z.string().uuid({
    message: 'Invalid device template ID',
  }),
  files: z.array(z.instanceof(File)).min(1, {
    message: 'At least one file must be uploaded',
  }),
});

export const connectHypervisorSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  apiKey: z.string().min(1, {
    message: 'API key is required',
  }),
  vendor: z.enum(HypervisorVendor),
  apiUrl: z.url().min(1, {
    message: 'API URL is required',
  }),
  connectPortIds: z.array(z.uuidv4()).min(1, {
    message: 'At least one port ID must be provided',
  }),
});