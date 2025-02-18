import { AccountResType, UpdateEmployeeAccountBodyType } from '@/domain/schemas/account.schema';
import meService from '@/infrastructure/services/me.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Me

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

// Employee
export const useGetAccountListQuery = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: meService.listAccounts
  });
};

export const useGetAccountByIdQuery = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: ['account', id],
    queryFn: () => meService.getEmployee(id)
  });
};

export const useCreateAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: meService.createEmployee,
    onSuccess: () => {
      // Invalidate query to refetch data
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    }
  });
};

export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...body }: UpdateEmployeeAccountBodyType & { id: number }) => meService.updateEmployee(id, body),
    onSuccess: () => {
      // Invalidate query to refetch data
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    }
  });
};

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: meService.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    }
  });
};
