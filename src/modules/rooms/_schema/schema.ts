import z from 'zod';

export const createRoomSchema = z.object({
  name: z.string().min(1, 'Room name is required'),
  x: z
    .number({
      message: 'X coordinate must be a number',
    })
    .min(0, 'X coordinate must be at least 0')
    .max(100, 'X coordinate must be at most 100'),
  y: z
    .number({
      message: 'Y coordinate must be a number',
    })
    .min(0, 'Y coordinate must be at least 0')
    .max(100, 'Y coordinate must be at most 100'),
});

export const createRackSchema = z.object({
  name: z.string().min(1, 'Rack name is required'),
  unitSize: z
    .number({
      message: 'Unit size must be a number',
    })
    .min(1, 'Unit size must be at least 1')
    .max(100, 'Unit size must be at most 100'),
});

export const addDeviceSchema = z.object({
  deviceIds: z
    .array(z.uuid({ message: 'Invalid device ID' }))
    .min(1, 'At least one device must be added'),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type CreateRackInput = z.infer<typeof createRackSchema>;
export type AddDeviceInput = z.infer<typeof addDeviceSchema>;

export const updateRoomSchema = createRoomSchema.partial();

export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
