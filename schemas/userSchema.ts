import z from 'zod';

const userData = z.object({
    id: z.number(),
    email: z.string(),
    password: z.string()
}) 
export const usersSchemas = z.array(userData);
