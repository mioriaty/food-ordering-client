'use client';

import { getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from '@/libs/utils/local-authentication';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface AuthContextProps {
  isAuth: boolean;
  setIsAuth: (isAuth: boolean) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  isAuth: false,
  setIsAuth: () => {}
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuth, setIsAuthState] = useState(false);

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      setIsAuthState(true);
    }
  }, []);

  // Nếu dùng Next 15 + React 19 thì không cần dùng useCallback, tránh thay đổi tham chiếu
  const setIsAuth = useCallback((isAuth: boolean) => {
    if (isAuth) {
      setIsAuthState(true);
    } else {
      setIsAuthState(false);
      removeTokensFromLocalStorage();
    }
  }, []);

  // Nếu dùng Next 15 + React 19 thì không cần AuthContext.Provider, AuthContext là đủ
  return <AuthContext.Provider value={{ isAuth, setIsAuth }}>{children}</AuthContext.Provider>;
};
