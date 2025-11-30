import z from 'zod';

export const createRoomSchema = z.object({
  name: z.string().min(1, 'Room name is required'),
  x: z.number({
    message: 'X coordinate must be a number',
  }),
  y: z.number({
    message: 'Y coordinate must be a number',
  }),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
