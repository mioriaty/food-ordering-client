'use client';

import { decodeToken } from '@/libs/utils/decode-token';
import { initSocketInstance } from '@/libs/utils/init-socket';
import { getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from '@/libs/utils/local-authentication';
import { RoleType } from '@/shared/types/jwt.types';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

interface AuthContextProps {
  role: RoleType | undefined;
  setRole: (role: RoleType | undefined) => void;
  isAuth: boolean;
  socket: Socket | undefined;
  setSocket: (socket: Socket | undefined) => void;
  disconnectSocket: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  role: undefined,
  setRole: () => {},
  isAuth: false,
  socket: undefined,
  setSocket: () => {},
  disconnectSocket: () => {}
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRoleState] = useState<RoleType | undefined>(undefined);
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const count = useRef(0);

  useEffect(() => {
    if (count.current === 0) {
      const accessToken = getAccessTokenFromLocalStorage();
      if (accessToken) {
        const decodedRole = decodeToken(accessToken).role;
        setRoleState(decodedRole);
        setSocket(initSocketInstance(accessToken));
      }
      count.current++;
    }
  }, []);

  const disconnectSocket = useCallback(() => {
    socket?.disconnect();
    setSocket(undefined);
  }, [socket, setSocket]);

  // Nếu dùng Next 15 + React 19 thì không cần dùng useCallback, tránh thay đổi tham chiếu
  const setRole = useCallback((role?: RoleType | undefined) => {
    setRoleState(role);
    if (!role) {
      removeTokensFromLocalStorage();
    }
  }, []);

  const isAuth = Boolean(role);

  // Nếu dùng Next 15 + React 19 thì không cần AuthContext.Provider, AuthContext là đủ
  return (
    <AuthContext.Provider value={{ role, setRole, isAuth, socket, setSocket, disconnectSocket }}>
      {children}
    </AuthContext.Provider>
  );
};
