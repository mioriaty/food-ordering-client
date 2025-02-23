import {
  CreateTableBodyType,
  TableListResType,
  TableResType,
  UpdateTableBodyType
} from '@/domain/schemas/table.schema';
import http from '@/infrastructure/http/fetcher';

const prefix = '/tables';

const tableService = {
  list: () => http.get<TableListResType>(prefix),
  getOne: (id: number) => http.get<TableResType>(`${prefix}/${id}`),
  create: (data: CreateTableBodyType) => http.post<TableResType>(prefix, data),
  update: (id: number, data: UpdateTableBodyType) => http.put<TableResType>(`${prefix}/${id}`, data),
  delete: (id: number) => http.delete<TableResType>(`${prefix}/${id}`)
};

export default tableService;
