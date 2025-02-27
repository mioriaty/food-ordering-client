import guestService from '@/infrastructure/services/guest.service';
import { useMutation, useQuery } from '@tanstack/react-query';

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

export const useGuestOrderMutation = () => {
  return useMutation({
    mutationFn: guestService.order
  });
};

export const useGuestGetOrderListQuery = () => {
  return useQuery({
    queryFn: guestService.getOrderList,
    queryKey: ['guest-orders']
  });
};
