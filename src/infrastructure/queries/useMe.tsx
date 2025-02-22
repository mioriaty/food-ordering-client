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

export const useGetAccountByIdQuery = ({ id, enabledCall }: { id: number; enabledCall: boolean }) => {
  return useQuery({
    queryKey: ['accounts', id],
    queryFn: () => meService.getEmployee(id),
    enabled: enabledCall
  });
};

export const useCreateAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: meService.createEmployee,
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
    mutationFn: ({ id, ...body }: UpdateEmployeeAccountBodyType & { id: number }) => meService.updateEmployee(id, body),
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
    mutationFn: meService.deleteEmployee,
    onSuccess: () => {
      // Khi xóa tài khoản thành công:
      // 1. Đánh dấu tất cả queries có key là ['accounts'] là đã cũ (stale)
      // 2. Tự động gọi API để lấy lại danh sách tài khoản mới nhất
      // 3. Cập nhật giao diện với dữ liệu mới mà không cần reload trang
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    }
  });
};
