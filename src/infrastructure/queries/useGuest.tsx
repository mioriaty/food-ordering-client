import guestService from '@/infrastructure/services/guest.service';
import { useMutation } from '@tanstack/react-query';

export const useGuestLoginMutation = () => {
  return useMutation({
    mutationFn: guestService.login
  });
};

export const useGuestLogoutMutation = () => {
  return useMutation({
    mutationFn: guestService.logout
  });
};
