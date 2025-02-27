import { UpdateOrderBodyType } from '@/domain/schemas/order.schema';
import orderService from '@/infrastructure/services/order.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetOrderListQuery = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getOrderList
  });
};

export const useUpdateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, ...body }: UpdateOrderBodyType & { orderId: number }) =>
      orderService.updateOrder(orderId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
};
