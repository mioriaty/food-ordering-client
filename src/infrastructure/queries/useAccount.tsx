import {
  AccountResType,
  GetGuestListQueryParamsType,
  UpdateEmployeeAccountBodyType
} from '@/domain/schemas/account.schema';
import accountService from '@/infrastructure/services/account.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Me

export const useMeQuery = (onSuccess?: (data: AccountResType) => void) => {
  return useQuery({
    queryKey: ['account-profile'],
    queryFn: () =>
      accountService.getMe().then((res) => {
        // Cách sử dụng callback function trong tanstack
        onSuccess?.(res.payload);
        return res;
      })
  });
};

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: accountService.updateMe
  });
};

export const useChangePasswordMeMutation = () => {
  return useMutation({
    mutationFn: accountService.changePassword
  });
};

// Employee
export const useGetAccountListQuery = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: accountService.listAccounts
  });
};

export const useGetAccountByIdQuery = ({ id, enabledCall }: { id: number; enabledCall: boolean }) => {
  return useQuery({
    queryKey: ['accounts', id],
    queryFn: () => accountService.getEmployee(id),
    enabled: enabledCall
  });
};

export const useCreateAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountService.createEmployee,
    onSuccess: () => {
      // Khi tạo tài khoản mới thành công:
      // 1. Đánh dấu tất cả queries có key là ['accounts'] là đã cũ (stale)
      // 2. Tự động gọi API để lấy lại danh sách tài khoản mới nhất
      // 3. Cập nhật giao diện với dữ liệu mới mà không cần reload trang
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    }
  });
};

export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...body }: UpdateEmployeeAccountBodyType & { id: number }) =>
      accountService.updateEmployee(id, body),
    onSuccess: () => {
      // Khi cập nhật tài khoản thành công:
      // 1. Đánh dấu tất cả queries có key là ['accounts'] là đã cũ (stale)
      // 2. Tự động gọi API để lấy lại danh sách tài khoản mới nhất
      // 3. Cập nhật giao diện với dữ liệu mới mà không cần reload trang
      queryClient.invalidateQueries({ queryKey: ['accounts'], exact: true });
    }
  });
};

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountService.deleteEmployee,
    onSuccess: () => {
      // Khi xóa tài khoản thành công:
      // 1. Đánh dấu tất cả queries có key là ['accounts'] là đã cũ (stale)
      // 2. Tự động gọi API để lấy lại danh sách tài khoản mới nhất
      // 3. Cập nhật giao diện với dữ liệu mới mà không cần reload trang
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    }
  });
};

export const useGetGuestListQuery = (queries: GetGuestListQueryParamsType) => {
  return useQuery({
    queryKey: ['guests', queries],
    queryFn: () => accountService.guestList(queries)
  });
};

export const useCreateGuestMutation = () => {
  // const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountService.createGuest
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ['guests'] });
    // }
  });
};
