'use client';

import { UpdateOrderResType } from '@/domain/schemas/order.schema';
import { useGuestGetOrderListQuery } from '@/infrastructure/queries/useGuest';
import { Badge } from '@/libs/components/ui/badge';
import socket from '@/libs/socket';
import { formatCurrency } from '@/libs/utils/format-currency';
import { getVietnameseOrderStatus } from '@/libs/utils/get-vn-order-status';
import Image from 'next/image';
import { useEffect, useMemo } from 'react';

export const OrdersCart = () => {
  const { data, refetch } = useGuestGetOrderListQuery();

  const orders = useMemo(() => data?.payload.data || [], [data]);
  const totalPrice = useMemo(
    () => orders.reduce((sum, order) => sum + order.dishSnapshot.price * order.quantity, 0),
    [orders]
  );

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log('connected', socket.id);
    }

    function onDisconnect() {
      console.log('disconnected', socket.id);
    }

    function onUpdateOrder(_data: UpdateOrderResType['data']) {
      refetch();
    }

    socket.on('update-order', onUpdateOrder);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('update-order', onUpdateOrder);
    };
  }, [refetch]);

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
        <div className="w-full justify-center font-semibold text-center">
          <span>Tổng cộng · {orders.length} món</span> · <span>{formatCurrency(totalPrice)}</span>
        </div>
      </div>
    </>
  );
};
