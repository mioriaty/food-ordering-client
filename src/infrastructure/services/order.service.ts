import {
  GetOrderDetailResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
  PayGuestOrdersBodyType,
  PayGuestOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType
} from '@/domain/schemas/order.schema';
import http from '@/infrastructure/http/fetcher';
import qs from 'query-string';

const prefix = 'orders';

const orderService = {
  getOrderList: (queries: GetOrdersQueryParamsType) =>
    http.get<GetOrdersResType>(
      `/${prefix}?${qs.stringify({
        fromDate: queries.fromDate?.toISOString(),
        toDate: queries.toDate?.toISOString()
      })}`
    ),
  updateOrder: (orderId: number, body: UpdateOrderBodyType) =>
    http.put<UpdateOrderResType>(`/${prefix}/${orderId}`, body),
  getOrderDetail: (orderId: number) => http.get<GetOrderDetailResType>(`/${prefix}/${orderId}`),
  pay: (body: PayGuestOrdersBodyType) => http.post<PayGuestOrdersResType>(`/${prefix}/pay`, body)
};

export default orderService;
