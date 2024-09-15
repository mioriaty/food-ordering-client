import { z } from 'zod';

export const ENV_SCHEMA = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string()
});

const ENV_CONFIG = ENV_SCHEMA.safeParse({
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT
});

if (!ENV_CONFIG.success) {
  throw new Error('Invalid environment variables');
}

export const APP_ENV = ENV_CONFIG.data;
