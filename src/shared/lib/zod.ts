import z from 'zod';

export const uuidSchema = z.uuidv4({
  message: 'Invalid UUID format',
});
