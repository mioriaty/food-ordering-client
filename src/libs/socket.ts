import envConfig from '@/configs/env.config';
import { getAccessTokenFromLocalStorage } from '@/libs/utils/local-authentication';
import { io } from 'socket.io-client';

const socket = io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
  auth: {
    Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`
  }
});

export default socket;
