import authService from '@/infrastructure/services/auth.service';
import { useMutation } from '@tanstack/react-query';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authService.login
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: authService.logout
  });
};

export const useSetTokenToCookieMutation = () => {
  return useMutation({
    mutationFn: authService.setTokenToCookie
  });
};
