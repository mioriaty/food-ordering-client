import { OrdersCart } from './orders-cart';

export default function GuestOrdersPage() {
  return (
    <div className="max-w-[400px] w-full mx-auto space-y-4">
      <h1 className="text-center text-xl font-bold">Đơn hàng</h1>

      <OrdersCart />
    </div>
  );
}
