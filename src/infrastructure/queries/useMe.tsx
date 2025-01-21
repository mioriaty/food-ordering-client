import { AccountResType } from '@/domain/schemas/account.schema';
import meService from '@/infrastructure/services/me.service';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useMeQuery = (onSuccess?: (data: AccountResType) => void) => {
  return useQuery({
    queryKey: ['account-profile'],
    queryFn: () =>
      meService.getMe().then((res) => {
        // Cách sử dụng callback function trong tanstack
        onSuccess?.(res.payload);
        return res;
      })
  });
};

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: meService.updateMe
  });
};

export const useChangePasswordMeMutation = () => {
  return useMutation({
    mutationFn: meService.changePassword
  });
};
