import { GetOrdersQueryParamsType, PayGuestOrdersBodyType, UpdateOrderBodyType } from '@/domain/schemas/order.schema';
import orderService from '@/infrastructure/services/order.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetOrderListQuery = (queries: GetOrdersQueryParamsType) => {
  return useQuery({
    queryFn: () => orderService.getOrderList(queries),
    queryKey: ['orders', queries]
  });
};

export const useGetOrderDetailQuery = (orderId: number, enabledCall: boolean) => {
  return useQuery({
    queryFn: () => orderService.getOrderDetail(orderId),
    queryKey: ['orders', orderId],
    enabled: enabledCall
  });
};

export const useUpdateOrderMutation = () => {
  return useMutation({
    mutationFn: ({ orderId, ...body }: UpdateOrderBodyType & { orderId: number }) =>
      orderService.updateOrder(orderId, body)
  });
};

export const usePayOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: PayGuestOrdersBodyType) => orderService.pay(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
};
