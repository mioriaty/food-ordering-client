import { CreateDishBodyType, DishListResType, DishResType, UpdateDishBodyType } from '@/domain/schemas/dish.schema';
import http from '@/infrastructure/http/fetcher';

const prefix = '/dishes';

const dishService = {
  list: () => http.get<DishListResType>(prefix),
  getOne: (id: number) => http.get<DishResType>(`${prefix}/${id}`),
  create: (data: CreateDishBodyType) => http.post<DishResType>(prefix, data),
  update: (id: number, data: UpdateDishBodyType) => http.put<DishResType>(`${prefix}/${id}`, data),
  delete: (id: number) => http.delete<DishResType>(`${prefix}/${id}`)
};

export default dishService;
