'use client';

import { decodeToken } from '@/libs/utils/decode-token';
import { getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from '@/libs/utils/local-authentication';
import { RoleType } from '@/shared/types/jwt.types';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface AuthContextProps {
  role: RoleType | undefined;
  setRole: (role: RoleType | undefined) => void;
  isAuth: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  role: undefined,
  setRole: () => {},
  isAuth: false
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRoleState] = useState<RoleType | undefined>(undefined);

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      const decoded = decodeToken(accessToken);
      setRoleState(decoded.role);
    }
  }, []);

  // Nếu dùng Next 15 + React 19 thì không cần dùng useCallback, tránh thay đổi tham chiếu
  const setRole = useCallback((role?: RoleType | undefined) => {
    setRoleState(role);
    if (!role) {
      removeTokensFromLocalStorage();
    }
  }, []);

  const isAuth = Boolean(role);

  // Nếu dùng Next 15 + React 19 thì không cần AuthContext.Provider, AuthContext là đủ
  return <AuthContext.Provider value={{ role, setRole, isAuth }}>{children}</AuthContext.Provider>;
};
