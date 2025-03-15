'use client';

import { PayGuestOrdersResType, UpdateOrderResType } from '@/domain/schemas/order.schema';
import { useGuestGetOrderListQuery } from '@/infrastructure/queries/useGuest';
import { Badge } from '@/libs/components/ui/badge';
import { toast } from '@/libs/components/ui/use-toast';
import { OrderStatus } from '@/libs/constants/type';
import { formatCurrency } from '@/libs/utils/format-currency';
import { getVietnameseOrderStatus } from '@/libs/utils/get-vn-order-status';
import { useAuthStore } from '@/stores/auth.store';
import Image from 'next/image';
import { useEffect, useMemo } from 'react';

export const OrdersCart = () => {
  const { data, refetch } = useGuestGetOrderListQuery();
  const socket = useAuthStore((state) => state.socket);

  const orders = useMemo(() => data?.payload.data || [], [data]);
  const { waitForPayment, paid } = useMemo(() => {
    return orders.reduce(
      (result, order) => {
        if (
          order.status === OrderStatus.Pending ||
          order.status === OrderStatus.Processing ||
          order.status === OrderStatus.Delivered
        ) {
          return {
            ...result,
            waitForPayment: {
              price: result.waitForPayment.price + order.quantity * order.dishSnapshot.price,
              quantity: result.waitForPayment.quantity + order.quantity
            }
          };
        }

        if (order.status === OrderStatus.Paid) {
          return {
            ...result,
            paid: {
              price: result.paid.price + order.quantity * order.dishSnapshot.price,
              quantity: result.paid.quantity + order.quantity
            }
          };
        }

        return result;
      },
      { waitForPayment: { price: 0, quantity: 0 }, paid: { price: 0, quantity: 0 } }
    );
  }, [orders]);

  useEffect(() => {
    if (socket?.connected) {
      onConnect();
    }

    function onConnect() {
      console.log('connected', socket?.id);
    }

    function onDisconnect() {
      console.log('disconnected', socket?.id);
    }

    function onUpdateOrder(_data: UpdateOrderResType['data']) {
      toast({
        description: `Món ăn ${_data.dishSnapshot.name} vừa được cập nhật sang trạng thái: ${getVietnameseOrderStatus(
          _data.status
        )}`,
        variant: 'success'
      });
      refetch();
    }

    function onPayment(_data: PayGuestOrdersResType['data']) {
      toast({
        description: 'Đã thanh toán thành công',
        variant: 'success'
      });
      refetch();
    }

    socket?.on('connect', onConnect);
    socket?.on('disconnect', onDisconnect);
    socket?.on('update-order', onUpdateOrder);
    socket?.on('payment', onPayment);

    return () => {
      socket?.off('connect', onConnect);
      socket?.off('disconnect', onDisconnect);
      socket?.off('update-order', onUpdateOrder);
      socket?.off('payment', onPayment);
    };
  }, [refetch, socket]);

  return (
    <>
      {orders.map((order, index) => (
        <div key={order.id} className="flex gap-4">
          <div className="text-sm">{index + 1}</div>
          <div className="flex-shrink-0">
            <Image
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              className="object-cover w-[60px] h-[60px] rounded-md"
            />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm">{order.dishSnapshot.name}</h3>

            <div className="text-xs">
              <span className="font-semibold">{formatCurrency(order.dishSnapshot.price)}</span> x{' '}
              <Badge>{order.quantity}</Badge>
            </div>
          </div>

          <div className="flex-shrink-0 ml-auto flex justify-center items-center">
            <Badge variant="secondary">{getVietnameseOrderStatus(order.status)}</Badge>
          </div>
        </div>
      ))}

      <div className="sticky bottom-0">
        <div className="text-center space-y-2">
          <div className="space-x-1">
            <span className="font-semibold">Chưa thanh toán:</span>
            <Badge variant="outline">{waitForPayment.quantity} món</Badge>
            <Badge className="bg-sky-600">
              <span>{formatCurrency(waitForPayment.price)}</span>
            </Badge>
          </div>
          <div className="space-x-1">
            <span className="font-semibold">Đã thanh toán:</span>
            <Badge variant="outline">{paid.quantity} món</Badge>
            <Badge className="bg-green-700">
              <span>{formatCurrency(paid.price)}</span>
            </Badge>
          </div>
        </div>
      </div>
    </>
  );
};
