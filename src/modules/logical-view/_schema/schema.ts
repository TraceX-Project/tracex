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

export const connectHypervisorCredentialsSchema = z.object({
  apiKey: z.string().min(1, { message: 'API key is required' }),
  vendor: z.enum(HypervisorVendor, { message: 'Vendor is required' }),
  apiUrl: z.url(),
});

export const connectHypervisorNodesSchema = z.object({
  nodes: z
    .array(
      z.object({
        name: z.string().min(1),
        deviceTemplateId: z.uuidv4({ message: 'Device template is required' }),
        connectPortIds: z.array(z.uuidv4()).min(1, {
          message: 'At least one port must be connected',
        }),
      }),
      { message: 'At least one node must be configured' }
    )
    .min(1, { message: 'At least one node must be configured' }),
});

export const connectHypervisorSchema = z.object({
  apiKey: z.string().min(1, {
    message: 'API key is required',
  }),
  vendor: z.enum(HypervisorVendor, {
    message: 'Vendor is required',
  }),
  apiUrl: z.url(),
  nodes: z
    .array(
      z.object({
        name: z.string().min(1),
        deviceTemplateId: z.uuidv4({ message: 'Invalid device template ID' }),
        connectPortIds: z.array(z.uuidv4()).min(1, {
          message: 'At least one port ID must be provided',
        }),
      }),
    )
    .min(1, { message: 'At least one node must be configured' }),
});
