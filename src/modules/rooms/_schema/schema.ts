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
  sortOrder: z
    .number({
      message: 'Sort order must be a number', 
    })
    .min(1, 'Sort order must be at least 1')
    .max(1000, 'Sort order must be at most 1000'),
    roomId: z.uuidv4({ message: 'Invalid room ID'  }),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type CreateRackInput = z.infer<typeof createRackSchema>;

export const updateRoomSchema = createRoomSchema.partial();

export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
