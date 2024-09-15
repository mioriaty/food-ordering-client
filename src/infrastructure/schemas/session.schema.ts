import { z } from 'zod';

export const SlideSessionRequestSchema = z.object({}).strict();

export type SlideSessionRequestType = z.TypeOf<typeof SlideSessionRequestSchema>;

export const SlideSessionResponseSchema = z.object({
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

export type SlideSessionResponseType = z.TypeOf<typeof SlideSessionResponseSchema>;
