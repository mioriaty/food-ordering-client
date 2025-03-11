import envConfig from '@/configs/env.config';
import { io } from 'socket.io-client';

export const initSocketInstance = (accessToken: string) => {
  return io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
    auth: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};
