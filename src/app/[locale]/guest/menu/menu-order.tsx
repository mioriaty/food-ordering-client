'use client';

import { GuestCreateOrdersBodyType } from '@/domain/schemas/guest.schema';
import { useRouter } from '@/i18n/navigation';
import { useGetListDishQuery } from '@/infrastructure/queries/useDish';
import { useGuestOrderMutation } from '@/infrastructure/queries/useGuest';
import { LoadingButton } from '@/libs/components/loading-button';
import { formatCurrency } from '@/libs/utils/format-currency';
import { getVietnameseDishStatus } from '@/libs/utils/get-vn-dish-status';
import { handleErrorApi } from '@/libs/utils/handle-api-error';
import Image from 'next/image';
import { useMemo, useState } from 'react';

import Quantity from '@/app/[locale]/guest/menu/quantity';

// fake data

export const MenuOrder = () => {
  const data = useGetListDishQuery();
  const dishes = useMemo(() => data.data?.payload.data || [], [data]);
  const orderMutation = useGuestOrderMutation();
  const router = useRouter();

  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);

  const totalPrice = useMemo(() => {
    return orders.reduce((result, order) => {
      const dish = dishes.find((dish) => dish.id === order.dishId);
      if (!dish) return result;
      return result + order.quantity * dish.price;
    }, 0);
  }, [dishes, orders]);

  const handleQuantityChange = ({ dishId, quantity }: { dishId: number; quantity: number }) => {
    setOrders((prevOrders) => {
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== dishId);
      }

      const index = prevOrders.findIndex((order) => order.dishId === dishId);
      if (index === -1) {
        return [...prevOrders, { dishId, quantity }];
      }

      const newOrders = [...prevOrders];
      newOrders[index] = { ...newOrders[index], quantity };
      return newOrders;
    });
  };

  const handleOrder = async () => {
    if (orderMutation.isPending) return;

    try {
      await orderMutation.mutateAsync(orders);
      router.push('/guest/orders');
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  return (
    <>
      {dishes
        .filter((dish) => dish.status !== 'Hidden')
        .map((dish) => (
          <div key={dish.id} className="flex gap-4">
            <div className="flex-shrink-0">
              <Image
                src={dish.image}
                alt={dish.name}
                height={100}
                width={100}
                quality={100}
                className="object-cover w-[80px] h-[80px] rounded-md"
              />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm">{dish.name}</h3>
              <p className="text-xs">{dish.description}</p>
              <p className="text-xs font-semibold">{formatCurrency(dish.price)}</p>
              <p className="text-xs">{getVietnameseDishStatus(dish.status)}</p>
            </div>

            <div className="flex-shrink-0 ml-auto flex justify-center items-center">
              <Quantity
                disabled={dish.status === 'Unavailable'}
                value={orders.find((order) => order.dishId === dish.id)?.quantity ?? 0}
                onChange={(quantity) => handleQuantityChange({ dishId: dish.id, quantity })}
              />
            </div>
          </div>
        ))}
      <div className="sticky bottom-0">
        <LoadingButton
          disabled={orders.length === 0}
          isLoading={orderMutation.isPending}
          className="w-full justify-between"
          onClick={handleOrder}
        >
          <span>Giỏ hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </LoadingButton>
      </div>
    </>
  );
};
