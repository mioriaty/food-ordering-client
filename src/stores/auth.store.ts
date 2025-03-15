import { removeTokensFromLocalStorage } from '@/libs/utils/local-authentication';
import { RoleType } from '@/shared/types/jwt.types';
import { Socket } from 'socket.io-client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface IAuthState {
  role: RoleType | undefined;
  socket: Socket | undefined;
  isAuth: boolean;
}

type IAuthActions = {
  setRole: (role?: RoleType | undefined) => void;
  setSocket: (socket?: Socket | undefined) => void;
  disconnectSocket: () => void;
};

const initialState: IAuthState = {
  isAuth: false,
  role: undefined,
  socket: undefined
};

export const useAuthStore = create<IAuthState & IAuthActions>()(
  immer((set) => ({
    ...initialState,
    disconnectSocket: () =>
      set((state) => {
        state.socket?.disconnect();
        state.socket = undefined;
      }),
    setRole: (role) =>
      set((state) => {
        state.role = role;
        state.isAuth = Boolean(role);
        if (!role) {
          removeTokensFromLocalStorage();
        }
      }),
    setSocket: (socket) => set({ socket })
  }))
);
