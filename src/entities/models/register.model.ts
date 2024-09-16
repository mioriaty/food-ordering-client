import { z } from 'zod';

export const RegisterRequestSchema = z
  .object({
    name: z.string().min(3).max(255),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100)
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword']
      });
    }
  });

export type RegisterRequestType = z.infer<typeof RegisterRequestSchema>;

export const RegisterResponseSchema = z.object({
  data: z.object({
    token: z.string(),
    expiresAt: z.string(),
    account: z.object({
      id: z.number(),
      name: z.string(),
      email: z.string()
    })
  }),
  message: z.string()
});

export type RegisterResponseType = z.TypeOf<typeof RegisterResponseSchema>;
