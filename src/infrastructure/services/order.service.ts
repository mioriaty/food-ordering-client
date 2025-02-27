import { GetOrdersResType, UpdateOrderBodyType, UpdateOrderResType } from '@/domain/schemas/order.schema';
import http from '@/infrastructure/http/fetcher';

const prefix = 'orders';

const orderService = {
  getOrderList: () => http.get<GetOrdersResType>(`/${prefix}`),
  updateOrder: (id: number, body: UpdateOrderBodyType) => http.put<UpdateOrderResType>(`/${prefix}/${id}`, body)
};

export default orderService;
