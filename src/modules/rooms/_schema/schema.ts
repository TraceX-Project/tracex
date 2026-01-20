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

export type CreateRoomInput = z.infer<typeof createRoomSchema>;

export const updateRoomSchema = createRoomSchema.partial();

export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
