import { z } from 'zod';

export const CLIENT_ENV_SCHEMA = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string(),
  NEXT_PUBLIC_API_URL: z.string()
});

const CLIENT_ENV_CONFIG = CLIENT_ENV_SCHEMA.safeParse({
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
});

if (!CLIENT_ENV_CONFIG.success) {
  console.error(CLIENT_ENV_CONFIG.error.errors);
  throw new Error('Invalid environment variables');
}

export const CLIENT_ENV = CLIENT_ENV_CONFIG.data;
